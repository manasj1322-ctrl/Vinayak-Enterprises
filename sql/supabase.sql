-- Paste this whole file in Supabase > SQL Editor > Run
create table headings (id bigint generated always as identity primary key, name text not null);
create unique index headings_name_uq on headings (lower(name));  -- blocks duplicate headings

create table clients (
  id bigint generated always as identity primary key,
  name text not null, contact text not null default '', company text not null default '', address text not null default '',
  heading_id bigint references headings(id),
  created_at timestamptz default now(),
  unique (name, contact)
);
create table entries (
  id bigint generated always as identity primary key,
  entry_date date not null default current_date,
  client_id bigint not null references clients(id) on delete cascade,
  heading_id bigint not null references headings(id),
  company text not null default '', contact text not null default '', address text not null default '', remark text,
  created_at timestamptz default now()
);
create index on entries (entry_date);
create index on entries (heading_id);

-- Only logged-in users can read/write
do $$ declare t text; begin
  foreach t in array array['headings','clients','entries'] loop
    execute format('alter table %I enable row level security', t);
    execute format('create policy "authenticated full access" on %I for all to authenticated using (true) with check (true)', t);
  end loop;
end $$;

-- Starting data
insert into headings (name) values ('Manufacturing'),('IT Services'),('Retail'),('Healthcare');
insert into clients (name,contact,company,address,heading_id)
select v.n,v.c,v.co,v.a,h.id from (values
 ('Rahul Sharma','9820012345','TechNova Pvt Ltd','Andheri, Mumbai','IT Services'),
 ('Anita Desai','9833098765','Desai Stores','Vasai, Palghar','Retail'),
 ('Suresh Patil','9867011223','Patil Industries','Virar East','Manufacturing')) v(n,c,co,a,hn)
join headings h on h.name = v.hn;
insert into entries (client_id,heading_id,company,contact,address,remark)
select c.id,c.heading_id,c.company,c.contact,c.address,r.remark from clients c join (values
 ('Rahul Sharma','Wants demo next week'),('Anita Desai','Follow up on pricing'),('Suresh Patil','Quote sent')) r(n,remark) on r.n = c.name;
