import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://exeygxhnjfpovrocqzmo.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4ZXlneGhuamZwb3Zyb2Nxem1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNzc4MjIsImV4cCI6MjA4MDk1MzgyMn0.bHHaPor1l-uhzqNetZUbt08uyRibqWaxRmSf2_6fDTQ'
);

console.log('🔍 Verifying database setup...\n');

const tables = ['notes', 'events', 'resources', 'profiles', 'chats'];

for (const table of tables) {
    const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(0);

    if (error) {
        console.log(`❌ ${table}: ${error.message}`);
    } else {
        console.log(`✅ ${table}: Table exists and is accessible`);
    }
}

console.log('\n✨ Database verification complete!');
