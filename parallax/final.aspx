<!DOCTYPE html>
<html class="no-js" lang="en">
<head>
	<title>MarketUP - ERP Grátis</title>
    <meta name="keywords" content="erp software gratis, erp software, sistema erp gratis, sistema erp, descargar erp, descargar erp gratis, programa erp gratis, erp online, erp, erp online gratis" />
    <meta name="description" content="Sistema completo de gerenciamento para o pequeno e médio negócio" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
	<meta name="description" content="" />
	<meta name="viewport" content="width=device-width" />
	
    <link rel="Shortcut Icon" href="favicon.ico" type="image/x-icon" />
	<link rel="stylesheet" href="css/geral.css" />
	<link rel="stylesheet" href="css/form.css" />
    <link href="css/smoothness/jquery-ui-1.8.21.custom.css" rel="stylesheet" type="text/css" />

	<script src="js/jquery-1.7.min.js" type="text/javascript"></script> 
    <script src="js/jquery-ui-1.8.21.custom.min.js" type="text/javascript"></script>
    <script src="js/jquery.maskedinput-1.3.min.js" type="text/javascript"></script>
    <script src="js/jquery.loader.js" type="text/javascript"></script>
	<script src="js/CSSBrowserSelector.js" type="text/javascript"></script>
    <!--[if lt IE 9]><script src="js/html5.js"></script><![endif]-->
    <script src="js/site.js" type="text/javascript"></script>	
    <script type="text/javascript">

        var _gaq = _gaq || [];
        _gaq.push(['_setAccount', 'UA-32658355-1']);
        _gaq.push(['_setDomainName', 'marketup.com']);
        _gaq.push(['_trackPageview', location.pathname + location.search + location.hash]);

        (function () {
            var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
            ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
        })(); 

    </script>
</head>
<body id="confirmacao"> 
	<div id="page">
		<header>
			<div class="contentHeader">
				<h1>
                    <a href="index.aspx" title="MarketUP" class="logo">
                        <img src="img/logo.png" class="logoBig" alt="MarketUP">
                        <img src="img/logoSmall.png" class="logoSmall" alt="MarketUP">
                    </a>
                </h1>
			</div>
		</header>	
		<div id="main" class="clearfix">
			<section>
                <article class="mainContent"></article>
				<article class="content">
					<div class="form">
						<div>
							<h3 class="tit">Verifique seu e-mail:</h3>
							<fieldset>
							<div id="stage" class=""><span id="stage_text" class="final" style="width:95%">
                            <br />
                            <b>Mandamos para você um e-mail de verificação.</b><br /><br />
                            Para finalizar o seu cadastro e começar a usar o MarketUP, 
                            precisamos que você entre no e-mail que você informou e clique no link de confirmação de cadastro.<br /><br />
                            Obrigado,<br />
                            Equipe MarketUP
                            </span></div>
							</fieldset>
						</div>
					</div>
				</article>
				<div class="cb"></div>
                <div class="dn" id="show_message"></div>
			</section>
		</div>
	</div>
    <footer>
		<div>
			<nav>
				<a href="sobre.aspx" title="Sobre o MarketUP">Sobre o MarketUP</a>
				<a href="http://suporte.marketup.com/home" target="_blank" title="Ajuda">Ajuda</a>
                <a href="faq.aspx" title="Perguntas Frequentes">FAQ</a>
                <a href="politica.aspx" title="Política de Privacidade">Política de Privacidade</a>
				<a href="termos.aspx" title="Termo de Uso">Termo de Uso</a>
                <a href="http://suporte.marketup.com/anonymous_requests/new" title="Contato">Contato</a>
				<a href="http://twitter.com/marketup_brasil" target="_blank" class="twitter" title="Twitter">Twitter</a>
				<a href="http://www.facebook.com/MarketUP.Brasil" target="_blank" class="facebook" title="Facebook">Facebook</a>
				<span class="cb"></span>
			</nav>
			<p>© Copyright 2012. Todos os direitos reservados MarketUP</p>
		</div>
	</footer>
    <script type="text/javascript">
        $(document).ready(function () {
            $(window).scroll(function () {
                var scrollTop = 0;

                if ($('html').hasClass('ie') || $('html').hasClass('gecko'))
                    scrollTop = $(window).scrollTop();
                else
                    scrollTop = $('body').scrollTop();


                if (scrollTop > 180) {
                    $('header').addClass('headerSmall');
                } else { $('header').removeClass('headerSmall'); }
            });
        });
    </script>
</body>
</html>