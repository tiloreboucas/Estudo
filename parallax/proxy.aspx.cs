using System;
using System.Web.Services;
using System.Data;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Converters;
using site.Extensions;
using System.Collections.Generic;
using System.Text;

public partial class _proxy : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
    }

    [WebMethod]
    public static string GetSegments()
    {
        DataTable tb = new DataTable();
        dvnDB.DB db = new dvnDB.DB();
        db.FillDataTable(tb, "SELECT a.id_segment, a.ds_segment FROM tb_segment(nolock) a ORDER BY (CASE a.id_segment WHEN 10 THEN 1 ELSE 0 END), a.ds_segment", CommandType.Text);
        return tb.ToJSON();
    }

    [WebMethod]
    public static string CheckDomain(string domain_name)
    {
        DataTable tb = new DataTable();
        dvnDB.DB db = new dvnDB.DB();
        db.FillDataTable(tb, "SELECT TOP 1 id_install FROM tb_install(nolock) WHERE LTRIM(RTRIM(LOWER(ds_domain))) = '" + domain_name.TrimStart().TrimEnd().ToLower() + "'", CommandType.Text);

        return (tb.Rows.Count > 0).ToJSON();
    }

    [WebMethod]
    public static string SendContact(string values)
    {
        try
        {
            Dictionary<string, string> parameters = JsonConvert.DeserializeObject<Dictionary<string, string>>(values);
            string Message = "";

            foreach (var p in parameters)
            {

                Message += "<b>" + p.Key + ":&nbsp;</p>" + p.Value + "<br />";
            }

            if (SendMail("atendimento@marketup.com", "MarketUp", "[MarketUp] - Contato através do Site", Message) == "ok")
            {
                return "\"{'success':'true'}\"";
            }
            else
            {
                return "\"{'success':'false'}\"";
            }

        }
        catch (Exception ex)
        {
            return "\"{'error':'" + ex.Message + "'}\"";
        }
    }

    [WebMethod]
    public static string SaveCompany(string values)
    {
        try
        {
            Dictionary<string, string> parameters = JsonConvert.DeserializeObject<Dictionary<string, string>>(values);

            DataTable tb = new DataTable();
            dvnDB.DB db = new dvnDB.DB();
            bool is_site = false;

            foreach (var p in parameters)
            {
                if (p.Key.ToLower().Equals("source") && p.Value.ToLower().Equals("site"))
                {
                    is_site = true;
                }
                else
                {
                    switch (p.Key.Substring(0, 3))
                    {
                        case "id_":
                        case "in_":
                            db.AddParameter(p.Key, DbType.Int32, Int32.Parse(p.Value));
                            break;
                        case "dt_":
                            db.AddParameter(p.Key, DbType.DateTime, DateTime.Parse(p.Value));
                            break;
                        default:
                            db.AddParameter(p.Key, DbType.String, p.Value);
                            break;
                    }
                }
            }

            if (is_site)
            {
                db.FillDataTable(tb, "sp_install_save", CommandType.StoredProcedure);
                if (tb.Rows.Count > 0)
                {
                    if (tb.Rows[0][0].ToString().Substring(0, 4) != "ERRO")
                    {
                        //Envio do email para validação do cadastro
                        StringBuilder sMail = new StringBuilder();
                        // 0 - Nome 
                        // 1 - Link de Confirmação

                        sMail.Append("<html>\n");
                        sMail.Append("	<head>\n");
                        sMail.Append("		<title></title>\n");
                        sMail.Append("	</head>\n");
                        sMail.Append("	<body>\n");
                        sMail.Append("		<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" bgcolor=\"#ffffff\" align=\"center\">\n");
                        sMail.Append("			<tr>\n");
                        sMail.Append("				<td>\n");
                        sMail.Append("					<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" bgcolor=\"#3f3c3c\" width=\"591\">\n");
                        sMail.Append("						<tr>\n");
                        sMail.Append("							<td width=\"44\" height=\"62\"></td>\n");
                        sMail.Append("							<td><img src=\"http://www.marketup.com/img/logo_mail.png\" alt=\"Bem Vindo\" style=\"display: block; border: none;\" /></td>\n");
                        sMail.Append("							<td width=\"306\"></td>\n");
                        sMail.Append("							<td><p><font face=\"Verdana\" size=\"3\" color=\"#fefefe\">Bem Vindo</font></p></td>\n");
                        sMail.Append("							<td width=\"37\"></td>\n");
                        sMail.Append("						</tr>\n");
                        sMail.Append("					</table>\n");
                        sMail.Append("					<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" bgcolor=\"#86c436\" width=\"591\">\n");
                        sMail.Append("						<tr>\n");
                        sMail.Append("							<td align=\"center\" height=\"37\"><font face=\"verdana\" size=\"2\" color=\"#000000\"><b>OBRIGADO POR SE CADASTRAR!</b></font></td>\n");
                        sMail.Append("						</tr>\n");
                        sMail.Append("					</table>\n");
                        sMail.Append("					<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"591\">\n");
                        sMail.Append("						<tr>\n");
                        sMail.Append("							<td width=\"1\" bgcolor=\"#86c436\"></td>\n");
                        sMail.Append("							<td width=\"27\" bgcolor=\"#ffffff\"></td>\n");
                        sMail.Append("							<td align=\"left\">\n");
                        sMail.Append("								<br />\n");
                        sMail.Append("								<p><font face=\"Verdana\" size=\"2\" color=\"#000000\">Prezado(a) {0},</font></p>\n");
                        sMail.Append("								<p><font face=\"Verdana\" size=\"2\" color=\"#000000\">Parabéns por se cadastrar no MarketUP o sistema de gestão que vai revolucionar o seu negócio!</font></p>\n");
                        sMail.Append("								<p><font face=\"Verdana\" size=\"2\" color=\"#000000\"><a href=\"{1}\">Clique aqui</a> para confirmar o seu e-mail ou copie e cole o link abaixo no seu navegador:</font></p>\n");
                        sMail.Append("								<p><font face=\"Verdana\" size=\"2\" color=\"#000000\"><a href=\"{1}\" target=\"_blank\">{1}</a></font></p>\n");
                        sMail.Append("								<p><font face=\"Verdana\" size=\"2\" color=\"#000000\">Ao confirmar o seu e-mail você será encaminhado para o sistema MarketUP</font></p>\n");
                        sMail.Append("								<p><font face=\"Verdana\" size=\"1\" color=\"#000000\"><b>Atenciosamente,<br />Gerência de Relacionamento</b><br/><a href=\"http://www.marketup.com/\" target=\"_blank\">http://www.MarketUP.com/</a></font></p>\n");
                        sMail.Append("								<p><font face=\"Verdana\" size=\"1\" color=\"#000000\">Se você teve algum problema, entre em contato conosco pelo nosso <a href=\"http://suporte.marketup.com/\" target=\"_blank\">Suporte Gratuito</a></font></p>\n");
                        sMail.Append("								<br />\n");
                        sMail.Append("							</td>\n");
                        sMail.Append("							<td width=\"27\" bgcolor=\"#ffffff\"></td>\n");
                        sMail.Append("							<td width=\"1\" bgcolor=\"#86c436\"></td>\n");
                        sMail.Append("						</tr>\n");
                        sMail.Append("						<tr>\n");
                        sMail.Append("							<td width=\"1\" height=\"1\" bgcolor=\"#86c436\" colspan=\"5\"></td>\n");
                        sMail.Append("						</tr>\n");
                        sMail.Append("						<tr>\n");
                        sMail.Append("							<td width=\"1\" height=\"5\" bgcolor=\"#ffffff\" colspan=\"5\"></td>\n");
                        sMail.Append("						</tr>\n");
                        sMail.Append("						<tr>\n");
                        sMail.Append("							<td align=\"center\" colspan=\"5\">\n");
                        sMail.Append("								<p><font face=\"Verdana\" size=\"1\" color=\"#000000\">Todos os direitos reservados - <a href=\"http://www.marketup.com/\" target=\"_blank\"><font color=\"#000000\">MarketUP.com</font></a></font></p>\n");
                        sMail.Append("							</td>\n");
                        sMail.Append("						</tr>\n");
                        sMail.Append("					</table>\n");
                        sMail.Append("				</td>\n");
                        sMail.Append("			</tr>\n");
                        sMail.Append("		</table>\n");
                        sMail.Append("	</body>\n");
                        sMail.Append("</html>\n");

                        string sBody = "", sName = "", sLink = "";

                        sName = parameters["ds_name"];
                        sLink = "http://marketup.com/confirmacao.aspx?" + tb.Rows[0][0].ToString();

                        sBody = string.Format(sMail.ToString(), sName, sLink);


                        if (SendMail(parameters["ds_email"], parameters["ds_name"], string.Format("{0}, seja bem vindo ao MarketUP!", parameters["ds_name"]), sBody) == "ok")
                        {
                            return "\"{'success':'true', 'mail':'true', 'token':'" + tb.Rows[0][0].ToString() + "'}\"";
                        }
                        else
                        {
                            return "\"{'success':'true', 'mail':'false', 'token':'" + tb.Rows[0][0].ToString() + "'}\"";
                        }

                    }
                }

                return "\"{'success':'false'}\"";
            }
            else
            {
                return SaveCompanyW8(values);
            }
        }
        catch (Exception ex)
        {
            return "{'error':'" + ex.Message + "'}";
        }
    }

    [WebMethod]
    public static string UpdateAttrCompany(string id_install, string ds_password, string ds_login)
    {
        try
        {

            DataTable tb = new DataTable();
            dvnDB.DB db = new dvnDB.DB();

            db.AddParameter("id_install", DbType.Int32, Int32.Parse(id_install));
            db.AddParameter("ds_password", DbType.String, ds_password);
            db.AddParameter("ds_login", DbType.String, ds_login);

            db.ExecuteNonQuery("sp_install_update_attr", CommandType.StoredProcedure);
            return "\"{'success':true}\"";
        }
        catch
        {
            return "\"{'success':false}\"";
        }
    }

    [WebMethod]
    public static object GetIdInstall(string ds_token)
    {

        DataTable tb = new DataTable();
        dvnDB.DB db = new dvnDB.DB();
        db.FillDataTable(tb, "SELECT id_install FROM tb_install(NOLOCK) WHERE ds_token = '" + ds_token + "'", CommandType.Text);
        if (tb.Rows.Count > 0)
        {
            return tb.Rows[0]["id_install"];
        }
        else
        {
            return null;
        }

    }

    [WebMethod]
    public static string RequestCep(string d)
    {

        DataTable tb = new DataTable();

        if (d.Trim().Equals("{}"))
        {
            return "CEP inválido.";
        }
        else
        {
            Dictionary<string, object> parameters;
            parameters = d.JSON2ParametersDictionary();
            if (parameters.ContainsKey("parameters"))
                parameters = parameters["parameters"].ToString().JSON2ParametersDictionary();

            if (parameters.ContainsKey("aux"))
            {
                string procName = "tls_getAddressByCep";

                dvnDB.DB db = new dvnDB.DB("cep");

                db.GetConnection();

                db.AddParameter("cep", DbType.String, parameters["aux"].ToString());
                db.FillDataTable(tb, procName, CommandType.StoredProcedure);
                if (tb.Rows.Count > 0) return tb.ToJSON();

            }
        }

        return tb.ToJSON();
    }

    [WebMethod]
    public static string ConfirmEmail(string confirm_token)
    {

        DataTable tb = new DataTable();
        dvnDB.DB db = new dvnDB.DB();
        db.FillDataTable(tb, "SELECT * FROM tb_install(NOLOCK) WHERE ds_token = '" + confirm_token + "'", CommandType.Text);
        if (tb.Rows.Count > 0)
        {
            db = new dvnDB.DB();
            db.ExecuteNonQuery("UPDATE tb_install SET in_confirmed = 1 WHERE id_install = " + tb.Rows[0]["id_install"].ToString(), CommandType.Text);

            //StringBuilder sMail = new StringBuilder();

            //sMail.Append("<html>\n");
            //sMail.Append("	<head>\n");
            //sMail.Append("		<title></title>\n");
            //sMail.Append("	</head>\n");
            //sMail.Append("	<body>\n");
            //sMail.Append("		<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" bgcolor=\"#ffffff\" align=\"center\">\n");
            //sMail.Append("			<tr>\n");
            //sMail.Append("				<td>\n");
            //sMail.Append("					<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" bgcolor=\"#3f3c3c\" width=\"591\">\n");
            //sMail.Append("						<tr>\n");
            //sMail.Append("							<td width=\"44\" height=\"62\"></td>\n");
            //sMail.Append("							<td><img src=\"http://www.marketup.com/img/logo_mail.png\" alt=\"Bem Vindo\" style=\"display: block; border: none;\" /></td>\n");
            //sMail.Append("							<td width=\"306\"></td>\n");
            //sMail.Append("							<td><p><font face=\"Verdana\" size=\"3\" color=\"#fefefe\">Bem Vindo</font></p></td>\n");
            //sMail.Append("							<td width=\"37\"></td>\n");
            //sMail.Append("						</tr>\n");
            //sMail.Append("					</table>\n");
            //sMail.Append("					<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" bgcolor=\"#86c436\" width=\"591\">\n");
            //sMail.Append("						<tr>\n");
            //sMail.Append("							<td align=\"center\" height=\"37\"><font face=\"verdana\" size=\"2\" color=\"#000000\"><b>ENTRAREMOS EM CONTATO</b></font></td>\n");
            //sMail.Append("						</tr>\n");
            //sMail.Append("					</table>\n");
            //sMail.Append("					<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"591\">\n");
            //sMail.Append("						<tr>\n");
            //sMail.Append("							<td width=\"1\" bgcolor=\"#86c436\"></td>\n");
            //sMail.Append("							<td width=\"27\" bgcolor=\"#ffffff\"></td>\n");
            //sMail.Append("							<td align=\"left\">\n");
            //sMail.Append("								<br />\n");
            //sMail.Append("								<p><font face=\"Verdana\" size=\"2\" color=\"#000000\">Seu e-mail foi validado com sucesso. Você agora é usuário do MarketUP!</font></p>\n");
            //sMail.Append("								<p><font face=\"Verdana\" size=\"2\" color=\"#000000\">Para a sua maior segurança estaremos fazendo a configuração inicial da sua conta em nosso sistema e dentro de no máximo 24 horas você vai receber um e-mail com as informações para utilização imediata do MarketUP em sua empresa.</font></p>\n");
            //sMail.Append("								<p><font face=\"Verdana\" size=\"1\" color=\"#000000\">Se você teve algum problema, entre em contato conosco pelo nosso <a href=\"http://suporte.marketup.com/\" target=\"_blank\">Suporte Gratuito</a></font></p><br></br>\n");
            //sMail.Append("							</td>\n");
            //sMail.Append("							<td width=\"27\" bgcolor=\"#ffffff\"></td>\n");
            //sMail.Append("							<td width=\"1\" bgcolor=\"#86c436\"></td>\n");
            //sMail.Append("						</tr>\n");
            //sMail.Append("						<tr>\n");
            //sMail.Append("							<td width=\"1\" height=\"1\" bgcolor=\"#86c436\" colspan=\"5\"></td>\n");
            //sMail.Append("						</tr>\n");
            //sMail.Append("						<tr>\n");
            //sMail.Append("							<td width=\"1\" height=\"5\" bgcolor=\"#ffffff\" colspan=\"5\"></td>\n");
            //sMail.Append("						</tr>\n");
            //sMail.Append("						<tr>\n");
            //sMail.Append("							<td align=\"center\" colspan=\"5\">\n");
            //sMail.Append("								<p><font face=\"Verdana\" size=\"1\" color=\"#000000\">Todos os direitos reservados - <a href=\"http://www.marketup.com/\" target=\"_blank\"><font color=\"#000000\">MarketUP.com</font></a></font></p>\n");
            //sMail.Append("							</td>\n");
            //sMail.Append("						</tr>\n");
            //sMail.Append("					</table>\n");
            //sMail.Append("				</td>\n");
            //sMail.Append("			</tr>\n");
            //sMail.Append("		</table>\n");
            //sMail.Append("	</body>\n");
            //sMail.Append("</html>\n");

            //string sNome = "", sEmail = "";

            //sNome = tb.Rows[0]["ds_name"].ToString();
            //sEmail = tb.Rows[0]["ds_email"].ToString();

            //string sBody = string.Format(sMail.ToString());

            //if (SendMail(sEmail, sNome, string.Format("MarketUP, email validado com sucesso.", sNome), sBody) == "ok")
            //{
            return "\"{'success': 'true'}\"";
            //}
            //else
            //{
            //    return "\"{'success': 'false', 'message':'Falha ao enviar email de confirmação.'}\"";
            //}
        }
        else
        {
            return "\"{'success': 'false', 'message':'Dados de confirmação inválidos.'}\"";
        }

    }

    [WebMethod]
    private static string InstallCompleted(string install_id)
    {
        // 0 - Nome
        // 1 - Dominío
        // 2 - Usuário
        // 3 - Senha

        DataTable tb = new DataTable();
        dvnDB.DB db = new dvnDB.DB();
        db.FillDataTable(tb, "SELECT * FROM tb_install(NOLOCK) WHERE id_install = '" + install_id + "'", CommandType.Text);
        if (tb.Rows.Count > 0)
        {
            StringBuilder sMail = new StringBuilder();

            sMail.Append("<html>\n");
            sMail.Append("	<head>\n");
            sMail.Append("		<title></title>\n");
            sMail.Append("	</head>\n");
            sMail.Append("	<body>\n");
            sMail.Append("		<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" bgcolor=\"#ffffff\" align=\"center\">\n");
            sMail.Append("			<tr>\n");
            sMail.Append("				<td>\n");
            sMail.Append("					<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" bgcolor=\"#3f3c3c\" width=\"591\">\n");
            sMail.Append("						<tr>\n");
            sMail.Append("							<td width=\"44\" height=\"62\"></td>\n");
            sMail.Append("							<td><img src=\"http://marketup.com/img/logo_mail.png\" alt=\"Bem Vindo\" style=\"display: block; border: none;\" /></td>\n");
            sMail.Append("							<td width=\"306\"></td>\n");
            sMail.Append("							<td><p><font face=\"Verdana\" size=\"3\" color=\"#fefefe\">Bem Vindo</font></p></td>\n");
            sMail.Append("							<td width=\"37\"></td>\n");
            sMail.Append("						</tr>\n");
            sMail.Append("					</table>\n");
            sMail.Append("					<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" bgcolor=\"#86c436\" width=\"591\">\n");
            sMail.Append("						<tr>\n");
            sMail.Append("							<td align=\"center\" height=\"37\"><font face=\"verdana\" size=\"2\" color=\"#000000\"><b>CADASTRO EFETUADO COM SUCESSO</b></font></td>\n");
            sMail.Append("						</tr>\n");
            sMail.Append("					</table>\n");
            sMail.Append("					<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"591\">\n");
            sMail.Append("						<tr>\n");
            sMail.Append("							<td width=\"1\" bgcolor=\"#86c436\"></td>\n");
            sMail.Append("							<td width=\"27\" bgcolor=\"#ffffff\"></td>\n");
            sMail.Append("							<td align=\"left\">\n");
            sMail.Append("								<br />\n");
            sMail.Append("								<p><font face=\"Verdana\" size=\"2\" color=\"#000000\">Olá, {0},</font></p>\n");
            sMail.Append("								<p><font face=\"Verdana\" size=\"2\" color=\"#000000\">O seu cadastro foi efetuado com sucesso!</font></p>\n");
            sMail.Append("								<p><font face=\"Verdana\" size=\"1\" color=\"#000000\"><b>Para acessar o sistema, acesse:</b> <a href=\"http://{1}/\" target=\"_blank\">{1}/</a></font></p>\n");
            sMail.Append("								<p><font face=\"Verdana\" size=\"1\" color=\"#000000\"><b>Seus dados:</b></font></p>\n");
            sMail.Append("								<p><font face=\"Verdana\" size=\"1\" color=\"#000000\"><b>Usuário: </b>{2}<br /><b>Senha: </b>{3}<br /></font></p><br />\n");
            sMail.Append("							</td>\n");
            sMail.Append("							<td width=\"27\" bgcolor=\"#ffffff\"></td>\n");
            sMail.Append("							<td width=\"1\" bgcolor=\"#86c436\"></td>\n");
            sMail.Append("						</tr>\n");
            sMail.Append("						<tr>\n");
            sMail.Append("							<td width=\"1\" height=\"1\" bgcolor=\"#86c436\" colspan=\"5\"></td>\n");
            sMail.Append("						</tr>\n");
            sMail.Append("						<tr>\n");
            sMail.Append("							<td width=\"1\" height=\"5\" bgcolor=\"#ffffff\" colspan=\"5\"></td>\n");
            sMail.Append("						</tr>\n");
            sMail.Append("						<tr>\n");
            sMail.Append("							<td align=\"center\" colspan=\"5\">\n");
            sMail.Append("								<p><font face=\"Verdana\" size=\"1\" color=\"#000000\">Todos os direitos reservados - <a href=\"http://www.marketup.com/\" target=\"_blank\"><font color=\"#000000\">MarketUP.com</font></a></font></p>\n");
            sMail.Append("							</td>\n");
            sMail.Append("						</tr>\n");
            sMail.Append("					</table>\n");
            sMail.Append("				</td>\n");
            sMail.Append("			</tr>\n");
            sMail.Append("		</table>\n");
            sMail.Append("	</body>\n");
            sMail.Append("</html>\n");


            string sNome = "", sDominio = "", sUsuario = "", sSenha = "", sEmail = "";

            sNome = tb.Rows[0]["ds_name"].ToString();
            sDominio = tb.Rows[0]["ds_domain"].ToString();
            sUsuario = RC4.RC4Helper.Decrypt(Int32.Parse(tb.Rows[0]["id_install"].ToString()), tb.Rows[0]["ds_login"].ToString());
            sSenha = RC4.RC4Helper.Decrypt(Int32.Parse(tb.Rows[0]["id_install"].ToString()), tb.Rows[0]["ds_password"].ToString());
            sEmail = tb.Rows[0]["ds_email"].ToString();

            string sBody = string.Format(sMail.ToString(), sNome, sDominio, sUsuario, sSenha);

            if (SendMail(sEmail, sNome, string.Format("{0}, sua configuração inicial foi concluída. Você já pode utilizar o seu MarketUP", sNome), sBody) == "ok")
            {
                return "\"{'success': 'true'}\"";
            }
            else
            {
                return "\"{'success': 'false', 'message':'Falha ao enviar email de confirmação.'}\"";
            }
        }
        else
        {
            return "\"{'success': 'false', 'message':'Dados de confirmação inválidos.'}\"";
        }

    }

    private static string SendMail(string pTo, string pToName, string pSubject, string pBody)
    {

        string nm_smtp_host = "smtp.gmail.com";
        int nm_smtp_port = 587;
        string nm_smtp_user = "marketup@marketup.com";
        string nm_nome_remetente = "MarketUP";
        string nm_smtp_pass = "MUP@omeg@123";

        System.Net.Mail.SmtpClient cliente = new System.Net.Mail.SmtpClient(nm_smtp_host, nm_smtp_port);
        cliente.EnableSsl = true;

        System.Net.Mail.MailAddress remetente = new System.Net.Mail.MailAddress(nm_smtp_user, nm_nome_remetente);
        System.Net.Mail.MailAddress destinatario = new System.Net.Mail.MailAddress(pTo, pToName);

        System.Net.Mail.MailMessage mensagem = new System.Net.Mail.MailMessage(remetente, destinatario);

        mensagem.IsBodyHtml = true;
        mensagem.Body = "<html><body>" + pBody + "</body></html>";
        mensagem.Subject = pSubject;

        System.Net.NetworkCredential credenciais = new System.Net.NetworkCredential(nm_smtp_user, nm_smtp_pass);
        cliente.Credentials = credenciais;

        try
        {
            cliente.Send(mensagem);
            return "ok";
        }
        catch (Exception e)
        {
            return "Exceção:" + e.ToString();
        }

    }

    private static string SaveCompanyW8(string values)
    {
        try
        {
            Dictionary<string, string> parameters = JsonConvert.DeserializeObject<Dictionary<string, string>>(values);

            DataTable tb = new DataTable();
            dvnDB.DB db = new dvnDB.DB();
            string ds_pass = "";
            foreach (var p in parameters)
            {
                if (p.Key.ToLower() == "ds_password") ds_pass = p.Value;
                switch (p.Key.Substring(0, 3))
                {
                    case "id_":
                    case "in_":
                        db.AddParameter(p.Key, DbType.Int32, Int32.Parse(p.Value));
                        break;
                    case "dt_":
                        db.AddParameter(p.Key, DbType.DateTime, DateTime.Parse(p.Value));
                        break;
                    default:
                        db.AddParameter(p.Key, DbType.String, p.Value);
                        break;
                }

            }

            db.AddParameter("ds_login", DbType.String, "");
            db.FillDataTable(tb, "sp_install_save", CommandType.StoredProcedure);
            if (tb.Rows.Count > 0)
            {
                if (tb.Rows[0][0].ToString().Substring(0, 4) != "ERRO")
                {
                    object id_inst = GetIdInstall(tb.Rows[0][0].ToString());
                    if (id_inst != null)
                    {
                        ds_pass = RC4.RC4Helper.Encrypt(Int32.Parse(id_inst.ToString()), ds_pass);
                        string user = RC4.RC4Helper.Encrypt(Int32.Parse(id_inst.ToString()), "admin");
                        string retorno = UpdateAttrCompany(id_inst.ToString(), ds_pass, user);
                        if (retorno.IndexOf("true") == -1)
                        {
                            return "\"{'success':'false'}\"";
                        }
                        else
                        {
                            //Envio do email para validação do cadastro
                            StringBuilder sMail = new StringBuilder();
                            // 0 - Nome 
                            // 1 - Link de Confirmação

                            sMail.Append("<html>\n");
                            sMail.Append("	<head>\n");
                            sMail.Append("		<title></title>\n");
                            sMail.Append("	</head>\n");
                            sMail.Append("	<body>\n");
                            sMail.Append("		<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" bgcolor=\"#ffffff\" align=\"center\">\n");
                            sMail.Append("			<tr>\n");
                            sMail.Append("				<td>\n");
                            sMail.Append("					<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" bgcolor=\"#3f3c3c\" width=\"591\">\n");
                            sMail.Append("						<tr>\n");
                            sMail.Append("							<td width=\"44\" height=\"62\"></td>\n");
                            sMail.Append("							<td><img src=\"http://www.marketup.com/img/logo_mail.png\" alt=\"Bem Vindo\" style=\"display: block; border: none;\" /></td>\n");
                            sMail.Append("							<td width=\"306\"></td>\n");
                            sMail.Append("							<td><p><font face=\"Verdana\" size=\"3\" color=\"#fefefe\">Bem Vindo</font></p></td>\n");
                            sMail.Append("							<td width=\"37\"></td>\n");
                            sMail.Append("						</tr>\n");
                            sMail.Append("					</table>\n");
                            sMail.Append("					<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" bgcolor=\"#86c436\" width=\"591\">\n");
                            sMail.Append("						<tr>\n");
                            sMail.Append("							<td align=\"center\" height=\"37\"><font face=\"verdana\" size=\"2\" color=\"#000000\"><b>OBRIGADO POR SE CADASTRAR!</b></font></td>\n");
                            sMail.Append("						</tr>\n");
                            sMail.Append("					</table>\n");
                            sMail.Append("					<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"591\">\n");
                            sMail.Append("						<tr>\n");
                            sMail.Append("							<td width=\"1\" bgcolor=\"#86c436\"></td>\n");
                            sMail.Append("							<td width=\"27\" bgcolor=\"#ffffff\"></td>\n");
                            sMail.Append("							<td align=\"left\">\n");
                            sMail.Append("								<br />\n");
                            sMail.Append("								<p><font face=\"Verdana\" size=\"2\" color=\"#000000\">Prezado(a) {0},</font></p>\n");
                            sMail.Append("								<p><font face=\"Verdana\" size=\"2\" color=\"#000000\">Parabéns por se cadastrar no MarketUP o sistema de gestão que vai revolucionar o seu negócio!</font></p>\n");
                            sMail.Append("								<p><font face=\"Verdana\" size=\"2\" color=\"#000000\"><a href=\"{1}\">Clique aqui</a> para confirmar o seu e-mail ou copie e cole o link abaixo no seu navegador:</font></p>\n");
                            sMail.Append("								<p><font face=\"Verdana\" size=\"2\" color=\"#000000\"><a href=\"{1}\" target=\"_blank\">{1}</a></font></p>\n");
                            sMail.Append("								<p><font face=\"Verdana\" size=\"2\" color=\"#000000\">Ao confirmar o seu e-mail você será encaminhado para o sistema MarketUP</font></p>\n");
                            sMail.Append("								<p><font face=\"Verdana\" size=\"1\" color=\"#000000\"><b>Atenciosamente,<br />Gerência de Relacionamento</b><br/><a href=\"http://www.marketup.com/\" target=\"_blank\">http://www.MarketUP.com/</a></font></p>\n");
                            sMail.Append("								<p><font face=\"Verdana\" size=\"1\" color=\"#000000\">Se você teve algum problema, entre em contato conosco pelo nosso <a href=\"http://suporte.marketup.com/\" target=\"_blank\">Suporte Gratuito</a></font></p>\n");
                            sMail.Append("								<br />\n");
                            sMail.Append("							</td>\n");
                            sMail.Append("							<td width=\"27\" bgcolor=\"#ffffff\"></td>\n");
                            sMail.Append("							<td width=\"1\" bgcolor=\"#86c436\"></td>\n");
                            sMail.Append("						</tr>\n");
                            sMail.Append("						<tr>\n");
                            sMail.Append("							<td width=\"1\" height=\"1\" bgcolor=\"#86c436\" colspan=\"5\"></td>\n");
                            sMail.Append("						</tr>\n");
                            sMail.Append("						<tr>\n");
                            sMail.Append("							<td width=\"1\" height=\"5\" bgcolor=\"#ffffff\" colspan=\"5\"></td>\n");
                            sMail.Append("						</tr>\n");
                            sMail.Append("						<tr>\n");
                            sMail.Append("							<td align=\"center\" colspan=\"5\">\n");
                            sMail.Append("								<p><font face=\"Verdana\" size=\"1\" color=\"#000000\">Todos os direitos reservados - <a href=\"http://www.marketup.com/\" target=\"_blank\"><font color=\"#000000\">MarketUP.com</font></a></font></p>\n");
                            sMail.Append("							</td>\n");
                            sMail.Append("						</tr>\n");
                            sMail.Append("					</table>\n");
                            sMail.Append("				</td>\n");
                            sMail.Append("			</tr>\n");
                            sMail.Append("		</table>\n");
                            sMail.Append("	</body>\n");
                            sMail.Append("</html>\n");

                            string sBody = "", sName = "", sLink = "";

                            sName = parameters["ds_name"];
                            sLink = "http://marketup.com/confirmacao.aspx?" + tb.Rows[0][0].ToString();

                            sBody = string.Format(sMail.ToString(), sName, sLink);


                            if (SendMail(parameters["ds_email"], parameters["ds_name"], string.Format("{0}, seja bem vindo ao MarketUP!", parameters["ds_name"]), sBody) == "ok")
                            {
                                return "\"{'success':'true', 'mail':'true', 'token':'" + tb.Rows[0][0].ToString() + "'}\"";
                            }
                            else
                            {
                                return "\"{'success':'true', 'mail':'false', 'token':'" + tb.Rows[0][0].ToString() + "'}\"";
                            }

                        }
                    }
                    else
                    {
                        return "\"{'success':'false'}\"";
                    }

                }
            }

            return "\"{'success':'false'}\"";

        }
        catch (Exception ex)
        {
            return "{'error':'" + ex.Message + "'}";
        }
    }

}
