package com.java.inventorysystem.Utilities;

import java.sql.*;

public class ServletUtility {

	public static Connection getDatabaseConnection() {
		Connection conn = null;
		
		String host = System.getenv("DB_HOST");
		String port = System.getenv("DB_PORT");
		String user = System.getenv("DB_USER");
		String password = System.getenv("DB_PASS");
				
		String url = "jdbc:postgresql://" + host + ":" + port + "/postgres";
		
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
