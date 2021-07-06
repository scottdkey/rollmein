import { Migration } from '@mikro-orm/migrations';

export class Migration20210706071100 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user_options" ("user_id" varchar(255) not null, "roll_type" varchar(255) not null, "lock_after_out" bool not null, "theme" varchar(255) not null);');
    this.addSql('alter table "user_options" add constraint "user_options_pkey" primary key ("user_id");');

    this.addSql('create table "user" ("id" varchar(255) not null, "username" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
    this.addSql('alter table "user" add constraint "user_pkey" primary key ("id");');
    this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');

    this.addSql('create table "player" ("id" serial primary key, "user_id" varchar(255) not null, "name" varchar(255) not null, "tank" bool not null, "healer" bool not null, "dps" bool not null, "locked" bool not null, "in_the_roll" bool not null, "created_at" varchar(255) not null, "updated_at" varchar(255) not null);');

    this.addSql('alter table "player" add constraint "player_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
  }

}
