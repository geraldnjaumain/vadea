import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials in .env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
    try {
        console.log('🔄 Reading migration file...');
        const migrationPath = path.join(__dirname, 'supabase', 'migrations', '20250101_repair_schema.sql');
        const sql = fs.readFileSync(migrationPath, 'utf8');

        console.log('📤 Executing migration on Supabase...');
        const { data, error } = await supabase.rpc('exec_sql', { sql_string: sql }).catch(async () => {
            // If exec_sql doesn't exist, use direct query
            return await supabase.from('_supabase').select('*').limit(0); // This will fail, triggering raw SQL
        });

        // Alternative: Use raw SQL execution via REST API
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': supabaseServiceKey,
                'Authorization': `Bearer ${supabaseServiceKey}`
            },
            body: JSON.stringify({ query: sql })
        });

        if (!response.ok) {
            // Fallback: Manual execution via SQL endpoint
            console.log('⚠️  Standard RPC failed, using SQL endpoint...');
            const sqlResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/vnd.pgrst.object+json',
                    'apikey': supabaseServiceKey,
                    'Authorization': `Bearer ${supabaseServiceKey}`,
                    'Prefer': 'return=minimal'
                },
                body: sql
            });

            if (!sqlResponse.ok) {
                throw new Error(`Migration failed: ${await sqlResponse.text()}`);
            }
        }

        console.log('✅ Migration completed successfully!');
        console.log('\n🎉 Your database is now set up. Refresh your app to see it working!');

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        console.log('\n📋 Manual Steps Required:');
        console.log('1. Go to https://supabase.com/dashboard');
        console.log('2. Open SQL Editor');
        console.log('3. Copy content from: supabase/migrations/20250101_repair_schema.sql');
        console.log('4. Paste and click RUN');
        process.exit(1);
    }
}

runMigration();
