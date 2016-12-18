create table id_pass_info (
  ipi_info serial,
  user_id integer,
  site_id integer,
  extra text
);


create table site (
  site_id serial,
  site_name text,
  site_url text
);

create table user_info (
  user_id serial,
  name text,
  pass text
);
a
create table site (
  site_id serial,
  site_name text,
  site_url text
);