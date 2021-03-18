package com.java.inventorysystem;

import java.sql.*;

public class ServletUtility {

	public static Connection getDatabaseConnection() {
		Connection conn = null;
		
		String url = "jdbc:postgresql://localhost/postgres";
		String user = "postgres";
		String password = "Letmein#1232";
				
		try {
			conn = DriverManager.getConnection(url, user, password);
			System.out.println("Successful connection to DB");
		}catch (SQLException e) {
			e.printStackTrace();
		}
		
		return conn;
	}
}
