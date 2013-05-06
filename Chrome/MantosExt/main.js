$("#main").loader();

$.ajax({
    url : "http://www.mantosdofutebol.com.br/feed/index.php",
    dataType : "xml",
    success : function(data){
        page(data);
        $("#main").loader('end');
    }
});

function page(xml){
    var Data = $.xml2json(xml);
    console.log(Data);

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
    for(var i = 0; i < Data.channel.item.length; i++){ $("#lista").append("<li><strong>"+ Data.channel.item[i].title +"</strong><div class='description'><div><button class='more' type='button'>+</button><a target='_blank' href='"+ Data.channel.item[i].link +"'>Ler na integra</a></li>"); }
}