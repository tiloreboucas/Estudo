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
    <link rel="stylesheet" href="css/smoothness/jquery-ui-1.8.21.custom.css" />
    
    <script src="js/CSSBrowserSelector.js" type="text/javascript"></script>
    <script src="js/jquery-1.7.min.js" type="text/javascript"></script>
    <script src="js/jquery-ui-1.8.21.custom.min.js" type="text/javascript"></script>
    <script src="js/jquery.maskedinput-1.3.min.js" type="text/javascript"></script>
    <script src="js/jquery.loader.js" type="text/javascript"></script>
    <script src="js/site.js" type="text/javascript"></script>
    <script src="js/placeholder.js" type="text/javascript"></script>
    <script src="js/jquery.formvalidator.js" type="text/javascript"></script>
    <script src="js/jquery.rc4.js" type="text/javascript"></script>
    <!--[if lt IE 10]><script src="js/html5.js"></script><![endif]-->
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
<body id="cadastro">
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
        <div id="fb-root">
        </div>
        <div id="main" class="clearfix">
            <section>				
                <article class="mainContent"></article>
				<article class="content">
					<div class="boxTitContent"><h2 class="titContent">É fácil, rápido e gratuito!</h2></div>
					<div class="form">
						<div id="divStep_1">
                            <a href="politica.aspx" class="lkPolicyForm" target="_blank">Política de Privacidade</a>
							<h3 class="tit">Administrador:</h3>
                            <p>Para usar o MarketUP você deve criar um usuário.</p>
							<fieldset>
								<ul>
									<li>									
										<a class="registreseFacebook" id="fb-auth" href="javascript:void(0);"><img src="img/btRegistreseUsandoFacebook.gif" alt="Registre-se Usando o Facebook"></a>
										<span>ou </span>
                                        <button id="no_face" class="noFacebook">Não Tenho Facebook</button>                                       
									</li>
									<li class="dn hdd">
										<input type="hidden" id="marketup§facebook_id" /><hr />
									</li>
									<li class="dn">
										<input id="marketup§ds_name" class="required" type="text" placeholder="Nome" style="width: 490px;" />
									</li>
									<li class="dn">
										<input id="marketup§ds_email" class="required preset email" type="text" placeholder="E-mail" style="width: 490px;" />
									</li>
									<li class="pr dn">
										<input class="required pass" id="marketup§ds_password" type="password" placeholder="Senha" style="width: 220px;" />
										<input class="required repass" id="_repassword" type="password" placeholder="Repetir senha" style="width: 221px;" />
									</li>
									<li class="dn">
										<button id="btAvancar" class="button off" type="button">Avançar</button>
									</li>
								</ul>
							</fieldset>
						</div>
						<div id="divStep_2">
                            <a href="politica.aspx" class="lkPolicyForm" target="_blank">Política de Privacidade</a>
							<h3 class="tit">Localização:</h3>
							<fieldset>
								<ul>
									<li>
										<input class="required marketupds_zip_code" id="marketup§ds_zip_code" type="text" placeholder="CEP" maxlength="8" style="width: 288px;" />
										<a id="marketup§bt_search" class="btBuscar marketupbt_search" href="javascript:void(0);"><img src="img/btBuscar.png" alt="Buscar"></a>
										<a class="buscarCep" href="http://www.buscacep.correios.com.br/servicos/dnec/index.do" target="_blank">Não sei meu CEP</a>
									</li>
									<li>
										<input class="required marketupds_address" id="marketup§ds_address" type="text" placeholder="Endereço" style="width: 377px;" />										
										<input class="required marketupds_number" id="marketup§ds_number" type="text" placeholder="N°" style="width: 65px;" />
									</li>
									<li>
										<input id="marketup§ds_complement" type="text" placeholder="Complemento" style="width: 169px;" />
										<input class="required marketupds_quarter" id="marketup§ds_quarter" type="text" placeholder="Bairro" style="width: 273px;" />
									</li>
									<li>	
                                        <input id="marketup§ds_city" class="marketupds_city required" type="text" placeholder="Cidade" />
										<input id="marketup§ds_state" class="marketupds_state required" type="text" placeholder="Estado" />
									</li>
									<li>
										<button id="" type="button" class="button btVoltar">Voltar</button>
										<button id="btAvancarLocalizacao" type="button" class="button btAvancar off">Avançar</button>
									</li>
								</ul>
							</fieldset>
						</div>
						<div id="divStep_3">
                            <a href="politica.aspx" class="lkPolicyForm" target="_blank">Política de Privacidade</a>
							<h3 class="tit">Empresa:</h3>
							<fieldset>
								<ul>
									<li>
										<input class="required"  id="marketup§ds_company" type="text" placeholder="Nome" style="width: 490px;" />
									</li>
									<li>
										<input class="required fl marketupds_domain" id="marketup§ds_domain" type="text" placeholder="Domínio" style="width: 225px;" />
										<div class="status">
                                            <img id="domain" src="img/dominio.png" alt="MarketUP.com" />											
                                            <div id="verificar">
												<img src="img/verificar_status_url.png" alt="Verificar" />											
											</div>
											<div id="disponivel" class="dn">
												<img src="img/verificado_status_url.png" alt="Disponível" />											
											</div>
											<div id="indisponivel"  class="dn">
												<img src="img/indisponivel_status_url.png" alt="Indisponível" />												
											</div>
										</div>
										<div class="cb"></div>
									</li>
									<li class="pr telBox">
										<select id="marketup§id_segment" class="marketupid_segment required" style="width: 255px; margin-right:10px;"></select>
                                        <input id="marketup§ds_phone" class="preset phone" type="text" maxlength="15" placeholder="Telefone" style="width: 227px;" />
									</li>
                                    <!-- li>
                                        <input type="checkbox" id="marketup§in_agree" value="1" />&nbsp;<a class="EULA" href="javascript:$('#show_eula').dialog();void(0);">Li e concordo com os Termos de Uso.</a>
                                    </li -->
									<li>
                                        <button id="" type="button" class="button btVoltar">Voltar</button>
										<button id="btAtivacao" type="button" class="button btConcluir off">Concluir</button>
									</li>
								</ul>
							</fieldset>
						</div>
					</div>
				</article>
				<div class="cb"></div>
                <div class="dn" id="show_message"></div>
                <div class="dn" id="show_eula"></div>
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
    <script type="text/ecmascript">
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

        window.fbAsyncInit = function () {
            FB.init({ appId: '479079042102724',
                status: true,
                cookie: true,
                xfbml: true,
                oauth: true
            });

            function updateButton(response) {
                var button = document.getElementById('fb-auth');

                if (response.authResponse) {
                    //user is already logged in and connected
                    var userInfo = document.getElementById('user-info');
                    FB.api('/me', function (response) {

                        $('#marketup§facebook_id').val(response.id);
                        $('#marketup§ds_name').val(response.name).addClass('valid');
                        $('#marketup§ds_email').val(response.email).addClass('valid');

                        $('#divStep_1 fieldset li.dn').not('.hdd').show();
                        $('#marketup§ds_password').focus();
                        //console.log(response);

                        //userInfo.innerHTML = '<img src="https://graph.facebook.com/'+ response.id + '/picture">' + response.name;
                        //button.innerHTML = 'Logout';
                    });
                    //                    button.onclick = function () {
                    //                        FB.logout(function (response) {
                    //                            var userInfo = document.getElementById('user-info');
                    //                            userInfo.innerHTML = "";
                    //                        });
                    //                    };
                } else {
                    //user is not connected to your app or logged out
                    //button.innerHTML = 'Login';
                    button.onclick = function () {
                        FB.login(function (response) {
                            if (response.authResponse) {
                                FB.api('/me', function (response) {
                                    //var userInfo = document.getElementById('user-info');
                                    //userInfo.innerHTML = '<img src="https://graph.facebook.com/' + response.id + '/picture" style="margin-right:5px"/>' + response.name;
                                    $('#marketup§facebook_id').val(response.id);
                                    $('#marketup§ds_name').val(response.name).addClass('valid');
                                    $('#marketup§ds_email').val(response.email).addClass('valid');

                                    $('#divStep_1 fieldset li.dn').not('.hdd').show();
                                    $('#marketup§ds_password').focus();
                                    //console.log(response);
                                });
                            } else {
                                //user cancelled login or did not grant authorization
                            }
                        }, { scope: 'email' });
                    }
                }
            }

            // run once with current status and whenever the status changes
            FB.getLoginStatus(updateButton);
            FB.Event.subscribe('auth.statusChange', updateButton);
        };

        (function () {
            var e = document.createElement('script'); e.async = true;
            e.src = document.location.protocol + '//connect.facebook.net/pt_BR/all.js';
            document.getElementById('fb-root').appendChild(e);
        } ());
        
        loadCadastro();
        
        </script>
</body>
</html>
