using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Sql;
using System.Data.SqlClient;
using System.Configuration;

namespace SearchToPlay {
	public class Connection {
		public static SqlConnection cn;
		public static void OpenConnection() {
			cn = new SqlConnection();
			cn.ConnectionString = ConfigurationManager.ConnectionStrings["DB_9B9C52_stp"].ToString();
			cn.Open();
		}

		public static void CloseConnection() {
			cn.Close();
		}
	}
}