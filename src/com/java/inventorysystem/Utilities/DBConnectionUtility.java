package com.java.inventorysystem.Utilities;

import java.sql.*;

public class DBConnectionUtility {

	public static Connection getDatabaseConnection() {
		Connection conn = null;
		String host, port, user, password, db = null;
		if(System.getenv("VERSION").equals("production")) {
			host = System.getenv("DB_HOST");
			user = System.getenv("DB_USER");
			password = System.getenv("DB_PASS");
			db = System.getenv("DB_DB");			
		}else {
			host = System.getenv("DEV_HOST");
			user = System.getenv("DEV_USER");
			password = System.getenv("DEV_PASS");
			db = System.getenv("DEV_DB");
		}
		
		port = System.getenv("DB_PORT");		
		
		String url = "jdbc:postgresql://" + host + ":" + port + "/" + db;
		
		try {
			Class.forName("org.postgresql.Driver");
			conn = DriverManager.getConnection(url, user, password);
			System.out.println("Successful connection to DB");
		}catch (SQLException se) {
			se.printStackTrace();
		}catch (Exception e) {
			e.printStackTrace();
		}
		
		return conn;
	}
}
