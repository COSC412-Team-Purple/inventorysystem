package com.java.inventorysystem.InventoryItemManagement;

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
		conn = DBConnectionUtility.getDatabaseConnection();

		int item_id = Integer.valueOf(request.getParameter("item_id"));
		String item_name = request.getParameter("item_name");
		String item_spec = request.getParameter("item_spec");
		double item_price = Double.valueOf(request.getParameter("item_price"));
		int item_quant = Integer.valueOf(request.getParameter("item_quant"));
		String item_loc = request.getParameter("item_loc");
		String dept_name = request.getParameter("dept_name");
		String item_category = request.getParameter("category");
		Date purchase_date = request.getDate("purchase_date");
		String item_brand = request.getParameter("item_brand");
		Text item_memo = request.getParameter("item_memo");

		System.out.println("ItemRegistration Servelt connecting to DB");

		JSONObject returnJson = new JSONObject();
		returnJson.put("item_name": item_id, "item_spec": item_spec, "item_price": item_price, "item_quant": item_quant, "item_loc": item_loc, "dept_name": dept_name, "category": item_category, "purchase_date": purchase_date, "item_brand": item_brand);

		
		try{
			JSONObject itemSearch = this.searchItem(item_name, item_spec, item_price, item_quant, item_loc, dept_name, item_category, purchase_date, item_brand);

			}
		}

		try{
			Statement stmt = conn.createStatement();
			Sting item = request.getParameter("?,?,?,?,?,?,?,?");
			String query = "INSERT INTO items (item_name, item_spec, item_price, item_quant, dept_name, category, purchase_date, item_brand, item_memo)" + "VALUES (?,?,?,?,?,?,?,?) RETURNING item_id";
			PreparedStatement stmt = conn.prepareStatement(query);
			stmt.setln(1, itemName);
			stmt.setln(2, itemSpec);
			stmt.setln(3, itemPrice);
			stmt.setln(4, itemQuant);
			stmt.setln(5, deptName);
			stmt.setln(6, itemCategory);
			stmt.setln(7, item_Date);
			stmt.setln(8, item_Brand);
			stmt.setln(9, item_memo);

			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}

		

		doGet(request, response);
	}
	private boolean isCategoryPresent(String category) throws SQLException {
		String categoryQuery = "SELECT * FROM items_by_category WHERE category = ?;";
		PreparedStatement stmt = conn.prepareStatement(categoryQuery);
		stmt.setString(1, category);
		ResultSet categorySelect = stmt.executeQuery();
		boolean categoryPresent = false;
		while(categorySelect.next()) {
			categoryPresent = true;
		}
		return categoryPresent;
	}

	private boolean isDepartmentPresent(String dept_name) throws SQLException{
		String deptQuery = "SELECT * FROM items WHERE dept_name = ?";
		PreparedStatement stmt = conn.prepareStatement(deptQuery);
		stmt.setString(1, dept_name);
		ResultSet deptSelect = stmt.executeQuery();
		boolean deptPresent = false;
		while(deptSelect.next()){
			deptPresent = true;
		}
		return deptPresent;
	}
	
	private boolean updateItemsByCategory(int update_id, int itemQuantity, String itemCategory) throws SQLException {
		String query = "SELECT items FROM items_by_category WHERE category = '" + itemCategory + "'";
		System.out.println(query);
		PreparedStatement stmt = conn.prepareStatement(query);
		ResultSet rs = stmt.executeQuery();
		boolean success = false;
		
		if(rs.next())
		{
			int items = rs.getInt("items");
			query = "UPDATE items_by_category SET items = " + (items + itemQuantity) + ", last_update_id = " + update_id + " WHERE category = '" + itemCategory + "'";
			System.out.println(query);
			stmt = conn.prepareStatement(query);
			int row = stmt.executeUpdate();
			
			success = (row == 1);
		}
		
		return success;
	}

	private boolean updateTotal(int itemQuantity, double item_price) throws SQLException {
		
		String query = "SELECT total_value FROM inventory_total";
		PreparedStatement stmt = conn.prepareStatement(query);
		ResultSet rs = stmt.executeQuery();
		boolean success = false;
		
		if(rs.next())
		{
			float total = rs.getDouble("total_value");
			total = total + (itemQuantity * item_price);
			query = "UPDATE inventory_total SET total_value = " + total + " WHERE total_id = 1";
			stmt = conn.prepareStatement(query);
			int row = stmt.executeUpdate();
			success = (row == 1);
		}
		
		return success;
	}

	
	
	//Build SQL statement for registering a new item to the DB
	private ResultSet registerNewItem(String name, int price, int quantity, String spec, String location, String dept, String category,  Date date, String brand, String note) throws SQLException {
		
		String query = "";
		PreparedStatement stmt = conn.prepareStatement(query);
		ResultSet rs = stmt.executeQuery();
			
		return rs;
	}

}
