import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  db: SQLiteObject;
  databaseName = 'contacts.db';

  constructor(private sqllite: SQLite, private sqlitePorter: SQLitePorter) { }

  async openDatabase() {
    try{
      this.db = await this.sqllite.create({ name: this.databaseName, location: 'default' });
      await this.createDatabase();
    }catch(error){
      console.error('Ocorreu um erro ao criar o banco de dados.', error);
    }
  }

  async createDatabase() {
    const sqlCreateDatabase = this.getCreateTable();
    const result = await this.sqlitePorter.importSqlToDb(this.openDatabase(), sqlCreateDatabase);
    return result ? true : false;
  }

  getCreateTable() {
    const sqls = [];
    sqls.push('CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY, name VARCHAR(60));');
    return sqls.join('\n');
  }

  executeSQL(sql: string, params?: any[]) {
    return this.db.executeSql(sql, params);
  }
}
