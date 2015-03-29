using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using System.Data;

namespace SearchToPlay {
	public partial class Default : System.Web.UI.Page {
		SqlCommand cmd = new SqlCommand();
		SqlDataAdapter adp = new SqlDataAdapter();
		DataTable dt = new DataTable();
		protected void InitializeDBProject() {
			Connection.OpenConnection();
			cmd = new SqlCommand();
			cmd.Connection = Connection.cn;
			cmd.CommandType = CommandType.Text;
			cmd.CommandText = "SELECT PlayerName, GameEndTime, ItemsPicked FROM DBProject ORDER BY GameEndTime, ItemsPicked, PlayerName ASC";

			adp = new SqlDataAdapter();
			adp.SelectCommand = cmd;

			dt = new DataTable();
			adp.Fill(dt);
			gvDatabase.DataSource = dt;
			gvDatabase.DataBind();
			Connection.CloseConnection();
		}

		protected void InitializeDBArcade() {
			Connection.OpenConnection();
			cmd = new SqlCommand();
			cmd.Connection = Connection.cn;
			cmd.CommandType = CommandType.Text;
			cmd.CommandText = "SELECT PlayerName, GameEndTime, ItemsPicked FROM DBArcade ORDER BY GameEndTime ASC";

			adp = new SqlDataAdapter();
			adp.SelectCommand = cmd;

			dt = new DataTable();
			adp.Fill(dt);
			gvDbArcade.DataSource = dt;
			gvDbArcade.DataBind();
			Connection.CloseConnection();
		}

		protected void InitializeDBTimeTrial() {
			Connection.OpenConnection();
			cmd = new SqlCommand();
			cmd.Connection = Connection.cn;
			cmd.CommandType = CommandType.Text;
			cmd.CommandText = "SELECT PlayerName, GameEndTime, ItemsPicked FROM DBTimeTrial ORDER BY ItemsPicked, GameEndTime ASC";

			adp = new SqlDataAdapter();
			adp.SelectCommand = cmd;

			dt = new DataTable();
			adp.Fill(dt);
			gvDbTimeTrial.DataSource = dt;
			gvDbTimeTrial.DataBind();
			Connection.CloseConnection();
		}
		protected void Page_Load(object sender, EventArgs e) {
			/*
			 * Uncomment this lines if enabling a web server
			 */
			//InitializeDBProject();
			//InitializeDBArcade();
			//InitializeDBTimeTrial();
			//gvDatabase.DataBind();
			//gvDbArcade.DataBind();
			//gvDbTimeTrial.DataBind();
		}

		protected void btnSubmit_Click(object sender, EventArgs e) {
			if (tbName.Text != string.Empty) {
				if (hdfIsArcade.Value == "0") {
					Connection.OpenConnection();
					SqlCommand cmd = new SqlCommand();
					cmd.CommandType = CommandType.Text;
					cmd.Connection = Connection.cn;
					cmd.CommandText = "INSERT INTO DBTimeTrial values(@PlayerName, @GameEndTime, @ItemsPicked, @DateAdded)";
					cmd.Parameters.Add("@PlayerName", SqlDbType.NVarChar).Value = tbName.Text;
					cmd.Parameters.Add("@GameEndTime", SqlDbType.NVarChar).Value = hdfGameEndTime.Value;
					cmd.Parameters.Add("@ItemsPicked", SqlDbType.NVarChar).Value = hdfItemsPicked.Value;
					cmd.Parameters.Add("@DateAdded", SqlDbType.NVarChar).Value = DateTime.Now;
					cmd.ExecuteNonQuery();

					Connection.CloseConnection();
				}

				if (hdfIsArcade.Value == "1") {
					Connection.OpenConnection();
					SqlCommand cmd = new SqlCommand();
					cmd.CommandType = CommandType.Text;
					cmd.Connection = Connection.cn;
					cmd.CommandText = "INSERT INTO DBArcade values(@PlayerName, @GameEndTime, @ItemsPicked, @DateAdded)";
					cmd.Parameters.Add("@PlayerName", SqlDbType.NVarChar).Value = tbName.Text;
					cmd.Parameters.Add("@GameEndTime", SqlDbType.NVarChar).Value = hdfGameEndTime.Value;
					cmd.Parameters.Add("@ItemsPicked", SqlDbType.NVarChar).Value = hdfItemsPicked.Value;
					cmd.Parameters.Add("@DateAdded", SqlDbType.NVarChar).Value = DateTime.Now;
					cmd.ExecuteNonQuery();

					Connection.CloseConnection();
				}
				tbName.Text = string.Empty;
			}

			gvDatabase.DataBind();
			gvDbArcade.DataBind();
			gvDbTimeTrial.DataBind();
			Response.Redirect("http://searchtoplay-001-site1.smarterasp.net/");
		}
	}
}