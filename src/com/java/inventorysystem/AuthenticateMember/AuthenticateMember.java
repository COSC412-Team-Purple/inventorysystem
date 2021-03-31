package com.java.inventorysystem.AuthenticateMember;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.java.inventorysystem.Utilities.*;
/**
 * Servlet implementation class AuthenticateMember
 */
@WebServlet("/AuthenticateMember")
public class AuthenticateMember extends HttpServlet {
	private static final long serialVersionUID = 1L;
    private Connection conn;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public AuthenticateMember() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		// 1. get received JSON data from request
		BufferedReader reader = new BufferedReader(new InputStreamReader(request.getInputStream()));
		
		String json_in = "";
		if(reader != null){
			json_in = reader.readLine();
			System.out.println(json_in);
		}
		
		// 2. initiate jackson mapper
		ObjectMapper mapper = new ObjectMapper();
		
		// 3. Convert received JSON to Input object containing the expected inputs
		Input input = mapper.readValue(json_in, Input.class);
		System.out.println("Got inputs: username=" + input.username + " and password=" + input.password);

		// 4. Do something with the input
		
		//connect to database
		conn = ServletUtility.getDatabaseConnection();
		try {
			Statement stmt = conn.createStatement();
			
			//TODO: convert password to hash and include in SQL statement?
			
			String query = "SELECT * FROM ";		//TODO: SQL statement, need to get username and password from database
			ResultSet rs = stmt.executeQuery(query);
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		//rs should contain the credentials if the statement was successful, otherwise will be empty?
		Output output = new Output();
		
		output.success = true;//for now
		
		// 5. Set response type to JSON
		response.setContentType("application/json");	
		
		// 6. Send Output object as JSON to client
		mapper.writeValue(response.getOutputStream(), output);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

	}

	//JSON Input and Output objects for mapping using the Jackson library
	private class Input
	{
		String username;
		String password;
	}
	
	private class Output
	{
		boolean success;
	}
}
