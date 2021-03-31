package com.java.inventorysystem.AuthenticateMember;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Map;
import java.util.Set;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONObject;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.java.inventorysystem.Utilities.*;
/**
 * Servlet implementation class AuthenticateMember
 */
@WebServlet("/AuthenticateMember")
public class AuthenticateMember extends HttpServlet {
	private static final long serialVersionUID = 1L;
    private Connection conn;
    private String defaultPassword = "Ch@ngeme!1234";
       
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
		System.out.println(request.getParameter("username"));
		System.out.println(request.getParameter("password"));	
		
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
		conn = DBConnectionUtility.getDatabaseConnection();
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
		conn = DBConnectionUtility.getDatabaseConnection();
		String username = request.getParameter("username");
		String password = request.getParameter("password");
		
		JSONObject returnJson = new JSONObject();
		try {
			//query for
			ResultSet memberInfoRs = authenticateMember(username, password);
			
			if(!memberInfoRs.first()) {
				response.sendError(400, "Member not in db");
			}else {
				int memberId = memberInfoRs.getInt("member_id");
				returnJson.put("memberId", memberId);
				
				ResultSet permissionRs = getMemberPermissions(memberId);
				String[] permissions = permissionRs.getString("permissions").split(",");
				returnJson.put("permissions", permissions);
				
				
				if(password.equals(defaultPassword)) {
					returnJson.put("needsPasswordReset", true);
				}else {
					returnJson.put("needsPasswordReset", false);
				}
				
				ClientResponseUtility.writeToClient(response, returnJson);
				response.setStatus(200);
			}

			conn.close();
		} catch (SQLException e) {
			response.sendError(400, "An error occurred");
			e.printStackTrace();
		}
	}

	
	private ResultSet authenticateMember(String username, String password) throws SQLException {
		
		
		//TODO: convert password to hash and include in SQL statement?
		
		String query = "SELECT member_id FROM Member WHERE username = ?, password = ?";		
		PreparedStatement stmt = conn.prepareStatement(query);
		stmt.setString(1, username);
		stmt.setString(2, password);
		ResultSet rs = stmt.executeQuery();
		return rs;
	}
	
	private ResultSet getMemberPermissions(int memberId) throws SQLException {
		//querying for position/role id
		String query = "SELECT position_id FROM dept_member WHERE member_id = ?";		
		PreparedStatement stmt = conn.prepareStatement(query);
		stmt.setInt(1, memberId);;
		ResultSet rs = stmt.executeQuery();
		
		//querying for permissions
		int position_id = rs.getInt("position_id");
		query = "SELECT perms FROM member_pos WHERE position_id = ?";
		PreparedStatement permQuery = conn.prepareStatement(query);
		permQuery.setInt(1, position_id);
		rs = stmt.executeQuery();
		
		
		return rs;
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
