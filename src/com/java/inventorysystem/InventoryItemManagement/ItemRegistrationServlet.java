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

import org.json.simple.JSONObject;

import com.java.inventorysystem.Utilities.ClientResponseUtility;
import com.java.inventorysystem.Utilities.DBConnectionUtility;

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
		int member_id = Integer.valueOf(request.getParameter("member_id"));
		
		String item_name = request.getParameter("item_name");
		String item_model = request.getParameter("item_model");
		double item_price = Double.valueOf(request.getParameter("item_price"));
		int item_quant = Integer.valueOf(request.getParameter("item_quant"));
		String item_loc = request.getParameter("item_loc");
		String dept_name = request.getParameter("dept_name");
		String item_category = request.getParameter("category");
		Date purchase_date = Date.valueOf(request.getParameter("purchase_date"));
		String item_brand = request.getParameter("item_brand");
		String item_memo = request.getParameter("item_memo");

		System.out.println("ItemRegistration Servelt connecting to DB");

		JSONObject returnJson = new JSONObject();
		
		//add item name to response json
		returnJson.put("item_name": item_name);
		returnJson.put("item_model": item_model);
		returnJson.put("item_price": item_price);
		returnJson.put("item_quant": item_quant);
		returnJson.put("item_loc": item_loc);
		returnJson.put("dept_name": dept_name);
		returnJson.put("cagtegory": item_category);
		returnJson.put("purchase_date": purchase_date);
		returnJson.put("item_brand": item_brand);
		returnJson.put("item_memo": item_memo);

		try{
			boolean itemPresent = isItemPresent(item_name, item_model, item_price, item_quant, dept_name, item_category, purchase_date, item_brand);
			returnJson.put("itemPresent", itemPresent);
			if(!itemPresent){
				// insert first
				ResultSet newItem = this.registerNewItem(item_name, item_price, item_quant, item_model,item_loc, dept_name, item_category, purchase_date, item_brand, item_memo);
				int item_id = 0;
				while (newItem.next()) {
					item_id = newItem.getInt("item_id");
				}
				// add item id to response json
				int update_id = InventoryManagementUtility.addRecordToItemQuantityUpdatesTable(member_id, item_id, item_name, 0, item_quant, item_memo, "initial registration", conn);
				System.out.println("update id: " + update_id);
				boolean updateItemsByCategory = InventoryManagementUtility.updateItemsByCategory(item_category, item_quant, update_id, conn);
				boolean totalValueUpdate = InventoryManagementUtility.updateTotalValue(item_quant, item_price, update_id, conn);
				

				if(!isDepartmentPresent(dept_name)){
					//function create dept passing the dept name
					ResultSet newDept = this.insertNewDepartment(dept_name);
					int dept_id = 0;
					while(newDept.next()){
						dept_id = newDept.getInt("dept_id");
					}
					}
				}				
			}
			
			ClientResponseUtility.writeToClient(response, returnJson);
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}

		
	}

	private boolean isItemPresent(String item_name, String item_model, Double item_price, Integer item_quant, String dept_name, String item_category, Date item_date, String item_brand) throws SQLException{
		String itemQuery = "SELECT * FROM items WHERE item_name = ? AND item_model = ? AND item_price = ? AND item_quant = ? AND category = ? AND item_date = ? AND item_brand = ?;";
		PreparedStatement stmt = conn.prepareStatement(itemQuery);
		stmt.setString(1, item_name);
		stmt.setString(2, item_model);
		stmt.setDouble(3, item_price);
		stmt.setInt(4, item_quant);
		stmt.setString(5, dept_name);
		stmt.setString(6, item_category);
		stmt.setDate(7, item_date);
		stmt.setString(8, item_brand);
		ResultSet itemSelect = stmt.executeQuery();
		boolean itemPresent = false;
		while(itemSelect.next()){
			itemPresent = true;
		}
		return itemPresent;
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
	

	private void insertNewDepartment(String dept_name) throws SQLException{
		String addDept = "INSERT INTO department (sub_dept_id, dept_name)" + "VALUES(?, ?)";
		PreparedStatement stmt = conn.prepareStatement(addDept);
		stmt.setInt(1, 1);
		stmt.setString(2, dept_name);

		stmt.executeQuery(addDept);
	}


	
	//Build SQL statement for registering a new item to the DB
	private ResultSet registerNewItem(String item_name, double item_price, int item_quant, String item_model, String item_loc, String dept_name, String item_category,  Date item_date, String item_brand, String item_memo) throws SQLException {

		String query = "INSERT INTO items (item_name, item_model, item_price, item_quant, dept_name, category, purchase_date, item_brand, item_memo) " 
						+ "VALUES (?,?,?,?,?,?,?,?) RETURNING item_id";
		PreparedStatement stmt = conn.prepareStatement(query);
		ResultSet rs = stmt.executeQuery();
		stmt.setString(1, item_name);
		stmt.setString(2, item_model);
		stmt.setDouble(3, item_price);
		stmt.setInt(4, item_quant);
		stmt.setString(5, dept_name);
		stmt.setString(6, item_category);
		stmt.setDate(7, item_date);
		stmt.setString(8, item_brand);
		stmt.setString(9, item_memo);

		stmt.executeQuery(query);
		return rs;
	}

}
