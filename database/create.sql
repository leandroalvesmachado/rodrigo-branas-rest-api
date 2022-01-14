create schema blog;

create table post(
    id serial primary key,
    title text not null,
    content text not null,
    date timestamp default now()
)

insert into posts(title, content) values ('Post 1', '......');
insert into posts(title, content) values ('Post 2', '......');
insert into posts(title, content) values ('Post 3', '......');
