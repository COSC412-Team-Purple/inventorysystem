package com.java.inventorysystem.AuthenticateMember;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Arrays;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONObject;

import com.java.inventorysystem.Utilities.*;
/**
 * Servlet implementation class ResetPassword
 */

/*
WORKFLOW

1. update the password in the member table with matching member_id
2. return success to client
*/
@WebServlet("/ResetPassword")
public class ResetPassword extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection conn;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ResetPassword() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		int member_id = Integer.valueOf(request.getParameter("member_id")); //need a name for the reset username field
		String newPassword = request.getParameter("password"); //need a name for the reset password field
		JSONObject returnJson = new JSONObject();
		
		if(verifyPassword(newPassword))
		{
			try {
				conn = DBConnectionUtility.getDatabaseConnection();
				
				if(setNewPassword(member_id, newPassword))
				{		
					returnJson.put("success", true);
					ClientResponseUtility.writeToClient(response, returnJson);
				}
				else
				{
					returnJson.put("success", false);
					ClientResponseUtility.writeToClient(response, returnJson);
				}
				
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
			
			
		}
		else
		{
			//Send JSON back saying that the operation was not successful
			returnJson.put("success", false);
			ClientResponseUtility.writeToClient(response, returnJson);
		}
		
		
	}
	
	//Check to make sure the new password meets all the password criteria
	private boolean verifyPassword(String password){
		boolean validchars = true; //no special characters such as space, tab or the 'ESC' key
		boolean number = false;    //at least one number
		boolean lowercase = false; //at least one upper case character
		boolean uppercase = false; //at least one lower case character
		boolean symbol = false;    //at least one symbol like ! or # or &
		boolean length = false;    //at least MIN_PASS_LENGTH characters long
		final int MIN_PASS_LENGTH = 6;
		
		if(password.length() >= MIN_PASS_LENGTH)
		{
			length = true;
		
			for(int i = 0; i < password.length(); i++)
			{
				char c = password.charAt(i);
				if(c < '!' || c > '~')
				{
					validchars = false;
					break;
				}
				
				if(c >= '0' && c <= '9')
				{
					number = true;
				}
				
				if(c >= 'a' && c <= 'z')
				{
					lowercase = true;
				}
				
				if(c >= 'A' && c <= 'Z')
				{
					uppercase = true;
				}
				
				if((c >= '!' && c <= '/') || (c >= ':' && c <= '@') || (c >= '[' && c <= '`') || (c >= '{' && c <= '~'))
				{
					symbol = true;
				}
			}
		}

		return validchars && number && lowercase && uppercase && symbol && length;
	}
	
	//Builds SQL string containing the member's new password hash that will be saved to the DB
	private boolean setNewPassword(int member_id, String password) throws SQLException {
		System.out.println("member id: " + member_id);
		System.out.println("new password: " + password);
		String query = "UPDATE member SET passw = ? WHERE member_id = ?;";
		PreparedStatement stmt = conn.prepareStatement(query);
		stmt.setString(1, password);
		stmt.setInt(2, member_id);
		int success = stmt.executeUpdate();

		if(success == 1)
		{
			return true;
		}
		
		return false;
	}

}
