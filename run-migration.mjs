import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabaseUrl = 'https://exeygxhnjfpovrocqzmo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4ZXlneGhuamZwb3Zyb2Nxem1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNzc4MjIsImV4cCI6MjA4MDk1MzgyMn0.bHHaPor1l-uhzqNetZUbt08uyRibqWaxRmSf2_6fDTQ';

const sql = readFileSync('./supabase/migrations/20250101_repair_schema.sql', 'utf8');

console.log('🚀 Executing migration via Supabase Management API...\n');

// Use the Supabase Management API to execute raw SQL
const response = await fetch(`https://api.supabase.com/v1/projects/exeygxhnjfpovrocqzmo/database/query`, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer sbp_98c69f8cb44eb6264abf094a2074895084dccc99`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: sql })
});

if (response.ok) {
    const result = await response.json();
    console.log('✅ Migration executed successfully!');
    console.log(result);
} else {
    const error = await response.text();
    console.error('❌ Migration failed:');
    console.error(error);
    console.log('\n📋 Please run manually in Supabase Dashboard SQL Editor');
}
