package com.java.inventorysystem.Utilities;

import java.sql.*;

public class DBConnectionUtility {

	public static Connection getDatabaseConnection() {
		Connection conn = null;
		
		String host = System.getenv("DEV_HOST");
		String port = System.getenv("DB_PORT");
		String user = System.getenv("DEV_USER");
		String password = System.getenv("DEV_PASS");
		String db = System.getenv("DEV_DB");
				
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
