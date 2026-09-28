import {DatabaseSync,type SQLInputValue} from 'node:sqlite';
import {mkdirSync} from 'node:fs';
import {join} from 'node:path';
const schema = `CREATE TABLE IF NOT EXISTS gallery_reflections(group_id TEXT PRIMARY KEY REFERENCES lab_groups(id),reflection TEXT NOT NULL,updated TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS gallery_settings(id INTEGER PRIMARY KEY,revealed INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS gallery_entries(group_id TEXT PRIMARY KEY REFERENCES lab_groups(id),tool TEXT NOT NULL,explanation TEXT NOT NULL,link TEXT NOT NULL DEFAULT '',action1 TEXT NOT NULL,output1 TEXT NOT NULL,action2 TEXT NOT NULL,output2 TEXT NOT NULL,updated TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS lab_session(id INTEGER PRIMARY KEY,phase INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS lab_groups(id TEXT PRIMARY KEY,owner TEXT UNIQUE NOT NULL,name TEXT UNIQUE NOT NULL,design TEXT NOT NULL,reflection TEXT NOT NULL DEFAULT '',updated TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS lab_responses(group_id TEXT NOT NULL REFERENCES lab_groups(id),case_id TEXT NOT NULL,action TEXT NOT NULL,output TEXT NOT NULL,change_note TEXT NOT NULL DEFAULT '',score TEXT,created TEXT NOT NULL,PRIMARY KEY(group_id,case_id));
CREATE TABLE IF NOT EXISTS screenshots(id TEXT PRIMARY KEY,group_id TEXT NOT NULL REFERENCES lab_groups(id),image BLOB NOT NULL,created TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS attempts(id TEXT PRIMARY KEY,n INTEGER NOT NULL,expires INTEGER NOT NULL);`;
let connection:DatabaseSync;
export function sqlite(){if(!connection){const dir=process.env.DATA_DIR||'./data';mkdirSync(dir,{recursive:true});connection=new DatabaseSync(join(dir,'lab.sqlite'));connection.exec('PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;');connection.exec(schema)}return connection}
export function db(){return {prepare(sql:string){let args:SQLInputValue[]=[];return {bind(...values:SQLInputValue[]){args=values;return this},async first<T>(){return (sqlite().prepare(sql).get(...args) as T|undefined)??null},async all<T>(){return {results:sqlite().prepare(sql).all(...args) as T[]}},async run(){const r=sqlite().prepare(sql).run(...args);return {meta:{changes:Number(r.changes)}}}}}}}
export function instructorEmail(){return 'instructor@local'}
