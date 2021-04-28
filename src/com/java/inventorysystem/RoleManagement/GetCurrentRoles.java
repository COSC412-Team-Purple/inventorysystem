package com.java.inventorysystem.RoleManagement;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import com.java.inventorysystem.Utilities.ClientResponseUtility;
import com.java.inventorysystem.Utilities.DBConnectionUtility;

/**
 * Servlet implementation class GetCurrentRoles
 */

/*
WORKFLOW

1. select * from member pos
2. return result set data to client
*/
@WebServlet("/GetRoles")
public class GetCurrentRoles extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection conn;
    /**
     * @see HttpServlet#HttpServlet()
     */
    public GetCurrentRoles() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		conn = DBConnectionUtility.getDatabaseConnection();
		System.out.println("Dashboard servlet connecting to DB");
		try {
			ResultSet rolesResults = this.getRoles();

			ClientResponseUtility.writeToClient(response, this.getJsonReturnObject(rolesResults));
			response.setStatus(200);
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
			response.sendError(400, "error finding inventory total and items by category data");
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

	private ResultSet getRoles() throws SQLException {
		
		String query = "SELECT * FROM position ORDER BY position_id ASC";
		PreparedStatement stmt = conn.prepareStatement(query);
		ResultSet results = stmt.executeQuery();
			
		return results;
	}
	
	private JSONArray getJsonReturnObject(ResultSet rolesResults) throws SQLException{
		
		JSONArray resultsJson = new JSONArray();
		List<String> roles = new ArrayList();
		while(rolesResults.next()) {
			JSONObject role = new JSONObject();
			role.put("roleId", rolesResults.getInt("position_id"));
			role.put("roleName", rolesResults.getString("name"));
			String[] perms = rolesResults.getString("perms").split(",");
			role.put("perms", Arrays.toString(perms));
			
			resultsJson.add(role);
		}
		
		
		return resultsJson;
	}
}
