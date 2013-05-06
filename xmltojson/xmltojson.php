
<?php
    function XmlToJson($url) {
        $fileContents= file_get_contents($url);
        $simpleXml = simplexml_load_string($fileContents);
        $json = json_encode($simpleXml);

        return $json;
    }
?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <script type="text/javascript"src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
        <script type="text/javascript"src="loader.js"></script>
        <script type="text/javascript">
            $(document).ready(function(){
                var str = '<?php print XmlToJson("http://www.mantosdofutebol.com.br/feed/index.php"); ?>';
                
                Data = JSON.parse(str);
                //console.log(Data);

                // Titulo
                $("h1 a").html(Data.channel.title).attr('href', Data.channel.link);

                // Subtitulo
                $("h2 a").html(Data.channel.description).attr('href', Data.channel.link);

                // Data e Hora
                var d = new Date(Data.channel.lastBuildDate);

                $("#data .dia").text(d.getDate());
                $("#data .mes").text(d.getMonth() + 1);
                $("#data .ano").text(d.getFullYear());

                $("#data .hora").text(d.getUTCHours());
                $("#data .minuto").text(d.getUTCMinutes());

                // Lista
                for(var i = 0; i < Data.channel.item.length; i++){ $("#lista").append("<li><a href='"+ Data.channel.item[i].link +"'><strong>"+ Data.channel.item[i].title +"</strong></a></li>"); }
            });
        </script>
    </head>
    <body>
        <h1><a href=""></a></h1>

        <h2><a href=""></a></h2>

        <p id="data">Atualizado em: <span class="dia"></span>/<span class="mes"></span>/<span class="ano"></span> às <span class="hora"></span>:<span class="minuto"></span></p>

        <ul id="lista">            
        </ul>
    </body>
</html>