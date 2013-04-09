using System;
using System.Configuration;
using System.Web;
using System.Web.SessionState;

// This code demonstrates how to make session state available in HttpModule,
// regradless of requested resource.
// author: Tomasz Jastrzebski

public class CountryModule : IHttpModule, IRequiresSessionState
{
    public void Init(HttpApplication context)
    {
        context.PreRequestHandlerExecute += PreRequestHandlerExecute;
    }

    public void Dispose() { }

    public void PreRequestHandlerExecute(object sender, EventArgs e)
    {
        if (!Convert.ToBoolean(ConfigurationManager.AppSettings["CountryModule"]))
            return ;


        HttpContext context = HttpContext.Current;
        if (context.Request.UserAgent.ToLower().Contains("googlebot")) return;

        if (context.Session == null) return;

        string CurrentIP = context.Request.ServerVariables["REMOTE_ADDR"];
        if ((CurrentIP == "127.0.0.1") || (CurrentIP == "::1")) { CurrentIP = "177.32.246.89"; }

        if ((context.Session["mktup_site_current_ip"] == null) || (context.Session["mktup_site_current_ip"].ToString() != CurrentIP))
        {
            context.Session["mktup_site_curren  t_ip"] = CurrentIP;
            site.CheckIP oCheck = new site.CheckIP();
            string Country = oCheck.GetCountryByIP(CurrentIP);
            context.Session["mktup_site_current_country"] = Country;
        }

        if (context.Session["mktup_site_current_country"].ToString() != "BR")
        {
            context.Response.Write("<!doctype html>\n");
            context.Response.Write("<html class=\"no-js\" lang=\"en\">\n");
            context.Response.Write("<head>\n");
            context.Response.Write("	<title>MarketUP</title>\n");
            context.Response.Write("	<meta http-equiv=\"Content-Type\" content=\"text/html; charset=iso-8859-1\" />\n");
            context.Response.Write("	<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge,chrome=1\">\n");
            context.Response.Write("	<meta name=\"description\" content=\"\">\n");
            context.Response.Write("	<meta name=\"viewport\" content=\"width=device-width\">\n");
            context.Response.Write("	<link rel=\"Shortcut Icon\" href=\"favicon.ico\" type=\"image/x-icon\" />\n");
            context.Response.Write("	<link rel=\"stylesheet\" href=\"css/geral.css\">\n");
            context.Response.Write("	<link rel=\"stylesheet\" href=\"css/form.css\">\n");
            context.Response.Write("    <link href=\"css/smoothness/jquery-ui-1.8.21.custom.css\" rel=\"stylesheet\" type=\"text/css\" />\n");
            context.Response.Write("	<script type=\"text/javascript\" src=\"js/jquery-1.7.min.js\"></script>\n");
            context.Response.Write("    <script src=\"js/jquery-ui-1.8.21.custom.min.js\" type=\"text/javascript\"></script>\n");
            context.Response.Write("    <script src=\"js/jquery.maskedinput-1.3.min.js\" type=\"text/javascript\"></script>\n");
            context.Response.Write("    <script src=\"js/jquery.loader.js\" type=\"text/javascript\"></script>\n");
            context.Response.Write("	<script type=\"text/javascript\" src=\"js/CSSBrowserSelector.js\"></script>\n");
            context.Response.Write("    <script type=\"text/javascript\" src=\"js/site.js\"></script>	\n");
            context.Response.Write("	<script type=\"text/javascript\" src=\"js/placeholder.js\"></script>\n");
            context.Response.Write("    <!--[if lt IE 10]><script src=\"js/html5.js\"></script><![endif]-->\n");
            context.Response.Write("</head>\n");
            context.Response.Write("<body id=\"comingSoon\"> \n");
            context.Response.Write("	<div id=\"page\">\n");
            context.Response.Write("		<header>\n");
            context.Response.Write("			<div class=\"contentHeader\">\n");
            context.Response.Write("			<h1>\n");
            context.Response.Write("				<a href=\"index.aspx\" title=\"MarketUp\" class=\"logo\"><img src=\"img/logo.png\" class=\"logoBig\" alt=\"MarketUP\"><img src=\"img/logoSmall.png\" class=\"logoSmall\" alt=\"MarketUP\"></a>\n");
            context.Response.Write("			</h1>\n");
            context.Response.Write("			</div>\n");
            context.Response.Write("		</header>	\n");
            context.Response.Write("		<div id=\"main\" class=\"clearfix\">\n");
            context.Response.Write("			<section>				\n");
            context.Response.Write("				<article class=\"mainContent\"></article>\n");
            context.Response.Write("				<article class=\"content\">\n");
            context.Response.Write("					<div class=\"boxText\"><p>Our subscriptions are closed. Fill in your email and we will inform you when they are available.</p></div>\n");
            context.Response.Write("					<div class=\"form\">\n");
            context.Response.Write("						<div>\n");
            context.Response.Write("							<fieldset>\n");
            context.Response.Write("								<ul>\n");
            context.Response.Write("									<li>\n");
            context.Response.Write("										<input class=\"required\" type=\"text\" id=\"coming§name\" name=\"Nome\" placeholder=\"Name\" style=\"width: 490px;\" />\n");
            context.Response.Write("									</li>\n");
            context.Response.Write("									<li>\n");
            context.Response.Write("										<input class=\"required\" type=\"text\" id=\"coming§company\" name=\"Empresa\" placeholder=\"Company\" style=\"width: 490px;\" />\n");
            context.Response.Write("									</li>\n");
            context.Response.Write("									<li>\n");
            context.Response.Write("										<input class=\"required\" type=\"text\" id=\"coming§email\" name=\"Email\" placeholder=\"E-Mail\" style=\"width: 490px;\" />\n");
            context.Response.Write("									</li>\n");
            context.Response.Write("									<li>\n");
            context.Response.Write("										<a class=\"enviarFormulario button\" href=\"javascript:void(0);\">Submit</a>\n");
            context.Response.Write("									</li>\n");
            context.Response.Write("								</ul>\n");
            context.Response.Write("							</fieldset>\n");
            context.Response.Write("						</div>\n");
            context.Response.Write("					</div>\n");
            context.Response.Write("				</article>\n");
            context.Response.Write("				<div class=\"cb\"></div>\n");
            context.Response.Write("				<div class=\"dn\" id=\"show_message\"></div>\n");
            context.Response.Write("			</section>\n");
            context.Response.Write("		</div>\n");
            context.Response.Write("	</div>\n");
            context.Response.Write("    <footer></footer>\n");
            context.Response.Write("    <script type=\"text/javascript\">loadComingSoon();</script>\n");
            context.Response.Write("</body>\n");
            context.Response.Write("</html>\n");
            context.Response.End();
        }
    }

}
