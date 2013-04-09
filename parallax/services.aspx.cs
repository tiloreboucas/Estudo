using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Web.Services;
using site.Extensions;

public partial class services : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
    }

    [WebMethod(EnableSession = true)]
    public static string GetFullWizard(string token)
    {

        System.Web.HttpContext context = System.Web.HttpContext.Current;
        var cookie = context.Cache[token];
       
        if ((cookie != null) && (!String.IsNullOrEmpty(cookie.ToString())))
        {
            string pars = cookie.ToString();
            string[] splt = pars.Split('§');
            int id = Int32.Parse(splt[0]);
            string ConnectionString = "Server=54.245.120.177;Database=marketup_" + id.ToString() + ";User ID=marketup_" + id.ToString() + ";Password=mktup" + id.ToString() + "|84-r1;Trusted_Connection=False;";
            DataTable dt;
            List<KeyValuePair<string, DataTable>> dt_array = new List<KeyValuePair<string, DataTable>>();
            try
            {
                using (SqlConnection oCn = new SqlConnection(ConnectionString))
                {
                    try
                    {
                        using (SqlCommand oSelCmd = new SqlCommand("[marketup_" + id.ToString() + "]..tls_widget_fin_1", oCn))
                        {
                            SqlDataAdapter dapt = new SqlDataAdapter(oSelCmd);
                            oSelCmd.CommandType = CommandType.StoredProcedure;
                            dapt.SelectCommand = oSelCmd;
                            dt = new DataTable();
                            dapt.Fill(dt);
                            dt_array.Add(new KeyValuePair<string, DataTable>("tls_widget_fin_1", dt));
                        }

                        using (SqlCommand oSelCmd = new SqlCommand("[marketup_" + id.ToString() + "]..tls_widget_fin_2", oCn))
                        {
                            SqlDataAdapter dapt = new SqlDataAdapter(oSelCmd);
                            oSelCmd.CommandType = CommandType.StoredProcedure;
                            dapt.SelectCommand = oSelCmd;
                            dt = new DataTable();
                            dapt.Fill(dt);
                            dt_array.Add(new KeyValuePair<string, DataTable>("tls_widget_fin_2", dt));
                        }

                        using (SqlCommand oSelCmd = new SqlCommand("[marketup_" + id.ToString() + "]..tls_widget_fin_3", oCn))
                        {
                            SqlDataAdapter dapt = new SqlDataAdapter(oSelCmd);
                            oSelCmd.CommandType = CommandType.StoredProcedure;
                            dapt.SelectCommand = oSelCmd;
                            dt = new DataTable();
                            dapt.Fill(dt);
                            dt_array.Add(new KeyValuePair<string, DataTable>("tls_widget_fin_3", dt));
                        }

                        using (SqlCommand oSelCmd = new SqlCommand("[marketup_" + id.ToString() + "]..tls_widget_fin_4", oCn))
                        {
                            SqlDataAdapter dapt = new SqlDataAdapter(oSelCmd);
                            oSelCmd.CommandType = CommandType.StoredProcedure;
                            dapt.SelectCommand = oSelCmd;
                            dt = new DataTable();
                            dapt.Fill(dt);
                            dt_array.Add(new KeyValuePair<string, DataTable>("tls_widget_fin_4", dt));
                        }

                        using (SqlCommand oSelCmd = new SqlCommand("[marketup_" + id.ToString() + "]..tls_widget_purchase_1", oCn))
                        {
                            SqlDataAdapter dapt = new SqlDataAdapter(oSelCmd);
                            oSelCmd.CommandType = CommandType.StoredProcedure;
                            dapt.SelectCommand = oSelCmd;
                            dt = new DataTable();
                            dapt.Fill(dt);
                            dt_array.Add(new KeyValuePair<string, DataTable>("tls_widget_purchase_1", dt));
                        }

                        using (SqlCommand oSelCmd = new SqlCommand("[marketup_" + id.ToString() + "]..tls_widget_purchase_2", oCn))
                        {
                            SqlDataAdapter dapt = new SqlDataAdapter(oSelCmd);
                            oSelCmd.CommandType = CommandType.StoredProcedure;
                            dapt.SelectCommand = oSelCmd;
                            dt = new DataTable();
                            dapt.Fill(dt);
                            dt_array.Add(new KeyValuePair<string, DataTable>("tls_widget_purchase_2", dt));
                        }

                        using (SqlCommand oSelCmd = new SqlCommand("[marketup_" + id.ToString() + "]..tls_widget_purchase_3", oCn))
                        {
                            SqlDataAdapter dapt = new SqlDataAdapter(oSelCmd);
                            oSelCmd.CommandType = CommandType.StoredProcedure;
                            dapt.SelectCommand = oSelCmd;
                            dt = new DataTable();
                            dapt.Fill(dt);
                            dt_array.Add(new KeyValuePair<string, DataTable>("tls_widget_purchase_3", dt));
                        }

                        using (SqlCommand oSelCmd = new SqlCommand("[marketup_" + id.ToString() + "]..tls_widget_purchase_4", oCn))
                        {
                            SqlDataAdapter dapt = new SqlDataAdapter(oSelCmd);
                            oSelCmd.CommandType = CommandType.StoredProcedure;
                            dapt.SelectCommand = oSelCmd;
                            dt = new DataTable();
                            dapt.Fill(dt);
                            dt_array.Add(new KeyValuePair<string, DataTable>("tls_widget_purchase_4", dt));
                        }

                        using (SqlCommand oSelCmd = new SqlCommand("[marketup_" + id.ToString() + "]..tls_widget_sale_1", oCn))
                        {
                            SqlDataAdapter dapt = new SqlDataAdapter(oSelCmd);
                            oSelCmd.CommandType = CommandType.StoredProcedure;
                            dapt.SelectCommand = oSelCmd;
                            dt = new DataTable();
                            dapt.Fill(dt);
                            dt_array.Add(new KeyValuePair<string, DataTable>("tls_widget_sale_1", dt));
                        }

                        using (SqlCommand oSelCmd = new SqlCommand("[marketup_" + id.ToString() + "]..tls_widget_sale_2", oCn))
                        {
                            SqlDataAdapter dapt = new SqlDataAdapter(oSelCmd);
                            oSelCmd.CommandType = CommandType.StoredProcedure;
                            dapt.SelectCommand = oSelCmd;
                            dt = new DataTable();
                            dapt.Fill(dt);
                            dt_array.Add(new KeyValuePair<string, DataTable>("tls_widget_sale_2", dt));
                        }

                        using (SqlCommand oSelCmd = new SqlCommand("[marketup_" + id.ToString() + "]..tls_widget_sale_3", oCn))
                        {
                            SqlDataAdapter dapt = new SqlDataAdapter(oSelCmd);
                            oSelCmd.CommandType = CommandType.StoredProcedure;
                            dapt.SelectCommand = oSelCmd;
                            dt = new DataTable();
                            dapt.Fill(dt);
                            dt_array.Add(new KeyValuePair<string, DataTable>("tls_widget_sale_3", dt));
                        }

                        using (SqlCommand oSelCmd = new SqlCommand("[marketup_" + id.ToString() + "]..tls_widget_sale_4", oCn))
                        {
                            SqlDataAdapter dapt = new SqlDataAdapter(oSelCmd);
                            oSelCmd.CommandType = CommandType.StoredProcedure;
                            dapt.SelectCommand = oSelCmd;
                            dt = new DataTable();
                            dapt.Fill(dt);
                            dt_array.Add(new KeyValuePair<string, DataTable>("tls_widget_sale_4", dt));
                        }

                        using (SqlCommand oSelCmd = new SqlCommand("[marketup_" + id.ToString() + "]..tls_widget_stock_1", oCn))
                        {
                            SqlDataAdapter dapt = new SqlDataAdapter(oSelCmd);
                            oSelCmd.CommandType = CommandType.StoredProcedure;
                            dapt.SelectCommand = oSelCmd;
                            dt = new DataTable();
                            dapt.Fill(dt);
                            dt_array.Add(new KeyValuePair<string, DataTable>("tls_widget_stock_1", dt));
                        }

                        using (SqlCommand oSelCmd = new SqlCommand("[marketup_" + id.ToString() + "]..tls_widget_stock_2", oCn))
                        {
                            SqlDataAdapter dapt = new SqlDataAdapter(oSelCmd);
                            oSelCmd.CommandType = CommandType.StoredProcedure;
                            dapt.SelectCommand = oSelCmd;
                            dt = new DataTable();
                            dapt.Fill(dt);
                            dt_array.Add(new KeyValuePair<string, DataTable>("tls_widget_stock_2", dt));
                        }

                        using (SqlCommand oSelCmd = new SqlCommand("[marketup_" + id.ToString() + "]..tls_widget_purchase_2", oCn))
                        {
                            SqlDataAdapter dapt = new SqlDataAdapter(oSelCmd);
                            oSelCmd.CommandType = CommandType.StoredProcedure;
                            dapt.SelectCommand = oSelCmd;
                            dt = new DataTable();
                            dapt.Fill(dt);
                            dt_array.Add(new KeyValuePair<string, DataTable>("tls_widget_stock_3", dt));
                        }

                        using (SqlCommand oSelCmd = new SqlCommand("[marketup_" + id.ToString() + "]..tls_widget_purchase_4", oCn))
                        {
                            SqlDataAdapter dapt = new SqlDataAdapter(oSelCmd);
                            oSelCmd.CommandType = CommandType.StoredProcedure;
                            dapt.SelectCommand = oSelCmd;
                            dt = new DataTable();
                            dapt.Fill(dt);
                            dt_array.Add(new KeyValuePair<string, DataTable>("tls_widget_stock_4", dt));
                        }
                    }
                    catch
                    {
                        if (oCn.State == System.Data.ConnectionState.Open)
                        {
                            oCn.Close();
                        }
                        throw;
                    }
                }

                return dt_array.ToJSON();
            }
            catch
            {
                return "{d:[]}";
            }
        }
        else
        {
            return "{d:[]}";
        }
    }

    [WebMethod(EnableSession = true)]
    public static string GetAccessToken(string domain, string user, string password)
    {
        DataTable dt;
        int id_inst = 0;
        domain = domain.Trim();
        user = user.Trim();
        using (SqlConnection oCn = new SqlConnection(ConfigurationManager.ConnectionStrings["site"].ConnectionString))
        {
            //[sp_get_id_by_domain]
            using (SqlCommand oSelCmd = new SqlCommand("sp_get_id_by_domain", oCn))
            {
                oSelCmd.Parameters.Add(new SqlParameter("@ds_domain", domain));
                SqlDataAdapter dapt = new SqlDataAdapter(oSelCmd);
                oSelCmd.CommandType = CommandType.StoredProcedure;
                dapt.SelectCommand = oSelCmd;
                dt = new DataTable();
                dapt.Fill(dt);
                if (dt.Rows.Count > 0) id_inst = Int32.Parse(dt.Rows[0][0].ToString());
            }

        }
        if (id_inst > 0)
        {
            string ConnectionString = "Server=54.245.120.177;Database=marketup_" + id_inst.ToString() + ";User ID=marketup_" + id_inst.ToString() + ";Password=mktup" + id_inst.ToString() + "|84-r1;Trusted_Connection=False;";
            using (SqlConnection oCn = new SqlConnection(ConnectionString))
            {
                //[sp_get_id_by_domain]
                using (SqlCommand oSelCmd = new SqlCommand("rg_per_sp_User_list", oCn))
                {
                    oSelCmd.Parameters.Add(new SqlParameter("ds_login", RC4.RC4Helper.Encrypt(id_inst, user)));//precisa passar esta parte para o windows 8 app
                    oSelCmd.Parameters.Add(new SqlParameter("ds_password", RC4.RC4Helper.Encrypt(id_inst, password)));//precisa passar esta parte para o windows 8 app
                    oSelCmd.Parameters.Add(new SqlParameter("in_block", 0));
                    SqlDataAdapter dapt = new SqlDataAdapter(oSelCmd);
                    oSelCmd.CommandType = CommandType.StoredProcedure;
                    dapt.SelectCommand = oSelCmd;
                    dt = new DataTable();
                    dapt.Fill(dt);
                    if (dt.Rows.Count > 0)
                    {
                        string tk = Guid.NewGuid().ToString("D");
                        System.Web.HttpContext context = System.Web.HttpContext.Current;


                        context.Cache.Insert(tk, 
                            (string)id_inst.ToString() + "§" + user + "§" + password,
                            null, 
                            DateTime.Now.AddMinutes(20), 
                            System.Web.Caching.Cache.NoSlidingExpiration
                        );
                       
                        //context.Application[tk] = id_inst.ToString() + "§" + user + "§" + password;
                        return "{d:[{ \"access_token\": \""+ tk +"\"}]}";
                    }
                    else
                    {
                        return "{d:[]}";
                    }
                }

            }

        }
        else
        {
            return "{d:[]}";
        }
    }
}