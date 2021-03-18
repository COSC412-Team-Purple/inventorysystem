package com.java.inventorysystem;

import java.sql.*;

public class ServletUtility {

	public static Connection getDatabaseConnection() {
		Connection conn = null;
		
		String url = "";
		String user = "";
		String password = "";
				
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
