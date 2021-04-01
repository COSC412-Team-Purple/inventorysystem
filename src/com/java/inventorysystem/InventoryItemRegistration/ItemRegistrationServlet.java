package com.java.inventorysystem.InventoryItemRegistration;

import java.io.IOException;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class ItemRegistrationServlet
 */

/*
 WORKFLOW
 
 1.	insert item into items table -> return item_id
 2. insert record into item_quantity_updates (member_id, item_id, item_name, 0 <-(old_quant), quantity <-(updated_quant), todays date, "initial item registration", "register") -> returning update_id
 3. update inventory total set total_value = (total_value + (quantity * price)) where total_id = 1
 4. if category not in db -> insert into items_by_category (category, quantity, update_id)
 	else -> update items_by_category set items = (items + quantity), last_update_id = update_id where category = registeredCategory -> returning items
 5. if dept not in db -> insert into department (1 (sub_dept_id ?), departmentName)
 */
@WebServlet("/ItemRegistration")
public class ItemRegistrationServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection conn;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ItemRegistrationServlet() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}
	
	
	//Build SQL statement for registering a new item to the DB
	private ResultSet registerNewItem(String name, int price, int quantity, String spec, String location, String dept, String category,  Date date, String brand, String note) throws SQLException {
		
		String query = "";
		PreparedStatement stmt = conn.prepareStatement(query);
		ResultSet rs = stmt.executeQuery();
			
		return rs;
	}

}
