var version =  'debug=0.0.1.3.6';
var Productos = '../@m-productos/productos';
var Orden = '../@m-orden/orden';
var Publicaciones = '../@m-publicaciones/publicaciones';
var AR = '../@m-AR/AR';
var Engine = '../@m-3dengine/engine';
var ColorPicker = '../@m-colorPicker/colorPicker';

var tienda;
var orden_dia;
var focused = false;
var sw;
var fromDay=false;
var database;


var dias;
var diaActual;
var diaRequested;
var notificaciones;
var horaActual;
var reqHora;
var id;
var categoria;
var loged = false;
var isCanastaShowing = false;
var horasViews;
var carList;
var hasChossenHour = false;
var editandoItem = false;
var dirs;
var user;
var guardando = false;
var marchante ="Main";
var confirmando = false;
var confirmar= false;
var ID_ENTREGA;
var fromMob;
var showingMenuMain = false;
var showingSessionMenu = false;
var cancelCloseMain = false;
var cancelCloseSessionMenu = false;
var cupones;
var cuponActivo;
var canToday;
var authChecked=false;
var toastBackStack;
var toasting = false;
var actualProd;
var showingProd=false;
var cancelCloseB = false;
var windState = 0;
var marchantes;
var anon;
var messaging;
var messaginToken;
var notPermission;
var reginPush = false;
var query;
var play_count = 3;
var photoUrl;
var pubs;
var shooting = false;
var autenticando = false;
var ordenes;
window.onblur = function(){
    window.onfocus = function(){
      tienda.setCategoriasAnimation(true);
      if(!focused){
          focused = true;
          console.log('retaking from suspended');
          if(!shooting&&!autenticando){
             goMain();
             autenticando= false;
          }else{
              console.log('autenticando');

          }

      }


    };
    if(window.localStream){
        var stream = window.localStream;
        stream.getVideoTracks()[0].stop();

    }
    if(focused){

        focused = false;
    }
      tienda.clearAnimation();

};




function hi(){
    orden_dia = new Orden();
    tienda = new Productos('Para Desayunar');
    pubs = new Publicaciones();







    var config = {
        apiKey: "AIzaSyBjNyJlkNfgM3QNQYrMn6qZ5z4okXp3BTE",
        authDomain: "today-6648d.firebaseapp.com",
        databaseURL: "https://today-6648d.firebaseio.com",
        projectId: "today-6648d",
        storageBucket: "today-6648d.appspot.com",
        messagingSenderId: "775057201875"
    };
    firebase.initializeApp(config);
    database = firebase.database();
    messaging = firebase.messaging();
    query = getUrlQuery();
    document.addEventListener('contextmenu', event => event.preventDefault());
    setDotListener();



    navigator.serviceWorker.register('service-worker.js')
        .then(function(reg){
        sw = reg;
        setup();
    }).catch(function(err) {

    });
}
var anim_dot;
var dot_timer;
var showCodComp = false;

function setDotListener(){
 document.getElementById('main_logo').addEventListener('touchstart', function(){

          mouseDown();


 }, true);
 document.getElementById('logoHead').addEventListener('mousedown', function(){

          mouseDown();


 }, true);


function mouseDown(){
        console.log('setting timer');
        clearTimeout(dot_timer);
         showCodComp = false;
        dot_timer = setTimeout(function(){
            showCodComp = true;
            if(user!=null){
                ingresarCodigo(1);
            }else{
                showAuthDialog();
            }
        }, 1500);



 };

 document.getElementById('main_logo').addEventListener('touchend', function(){
        clearTimeout(dot_timer);
        if(!showCodComp){
            playDot();
        }




 }, true);
 document.getElementById('logoHead').addEventListener('mouseup', function(){
        clearTimeout(dot_timer);
        if(!showCodComp){
            playDot();
        }




 }, true);


}

function playDot(){

    if(play_count>0){



        console.log('playing dot');
        var pos = 0;
        var opacity = 0;
        var reverse = false;
        clearInterval(anim_dot);
        anim_dot = setInterval(frame, 30);
        document.getElementById('code_counter').style.marginLeft = pos+"vw";
        document.getElementById('code_counter').style.opacity = opacity;
        document.getElementById('code_counter').style.display = "block";
        document.getElementById('code_counter').innerHTML = play_count+'!';
        play_count--;
        function frame(){
            if(pos>=80){
                clearInterval(anim_dot);
                console.log('Anim cleared');
                 document.getElementById('code_counter').style.display = "none";

            }else{

                if(!reverse){
                    pos= pos +2;
                    if(opacity<1){
                        opacity= opacity+0.1;
                         console.log('op ++');
                    }else{
                        if(pos>50){
                            reverse = true;
                            console.log('reverse true');
                        }
                    }

                }else if(opacity!=0){
                    pos= pos +1;
                    opacity = opacity-0.1;
                    console.log('op --');
                }

                document.getElementById('code_counter').style.marginLeft = pos+"vw";
                document.getElementById('code_counter').style.opacity = opacity;

            }
        }

    }else{
        if(user!=null){
            ingresarCodigo(0);
        }else{
            showAuthDialog();
        }

    }


}

function ingresarCodigo(type){
    document.getElementById('alert').style.display = "block";
    if(type==0){
        document.getElementById('alert').innerHTML = getCodigoView('Ingresa el Código Secetro');
    }else{
        document.getElementById('alert').innerHTML = getCodigoView('Ingresa el Codigo que tu amig@ te compartió');
    }

    document.getElementById('ok_cod').addEventListener('click', function(){
        var sanit = document.getElementById('cod_input').value.toString().split('>');
        if(sanit.length>1){
            var toast = new Toasty();
            toast.show('Fuck You', 2000);
        }else{
            var codico = sanit[0] ;
            if(type ==1){
                comprobarCodigoCompartir(codico);
            }else{

                comprobarCodigo(codico);
            }
        }

    });
     document.getElementById('cod_input').focus();
}
function comprobarCodigo(codigo){
    document.getElementById("alert").style.display = "none";
     var ref = database.ref('Codigos');
     ref.once('value', function(datasnapshot){
        if(datasnapshot.child(codigo).exists()){
            if(datasnapshot.child(codigo).val() == true){
                datasnapshot.ref.child(codigo).remove();
                setCupones();

            }else{
                var toast = new Toasty();
                toast.show("El Codigo ya je uso",2000);
            }
        }else{

            var toast = new Toasty();
            toast.show("El Codigo ingresado no existe, intentalo nuevamente",2000);
            ingresarCodigo(0);
        }

     });


}
function setCupones(){
    var ref = database.ref('Usuarios/'+id+'/Cupones');
    ref.once('value', function(datasnapshot){
        var pos = 0;
        if(datasnapshot.exists()){
            pos = datasnapshot.numChildren();
        }
        var percent = 10;
        for(var i=pos;i<pos+5;i++){
            datasnapshot.ref.child(i.toString()+'/value').set(percent);
            datasnapshot.ref.child(i.toString()+'/state').set(true);
            percent +=5;
        }
        var toast = new Toasty();
        toast.show("Felicidades, acabas de obtener 5 cupones, que esperas para canjearlos",3000);

    });
}
function clearCupones(reload){
    var ref = database.ref('Usuarios/'+id+'/Cupones');
    ref.once ('value', function(snapshot){
        if(snapshot.exists()){
            var cups = new Array();
            var pos = 0;
            snapshot.forEach(function(cupon){
                var valor = parseInt(cupon.child('value').val().toString(), 10);
                var state = cupon.child('state').val();
                if(state){
                    var cup = new Cupon(valor, state, pos);
                    pos++;
                    cups.push(cup);
                }

            });

            snapshot.ref.remove();

            restoreCupones(cups, reload);

        }else{
            console.log('No hay Cupones');
        }
    });

}
function restoreCupones(cups, reload){

    var ref = database.ref('Usuarios/'+id+'/Cupones');
    for(var i=0;i<cups.length;i++){
        ref.child(i.toString()+'/value').set(cups[i].valor);
        ref.child(i.toString()+'/state').set(cups[i].state);
    }
    if(reload){
        getCupones(true);
    }else{goMain();}


}
function comprobarCodigoCompartir(codigo){
    document.getElementById("alert").style.display = "none";
     var ref = database.ref('CodigosCompartir');
      ref.once('value', function(datasnapshot){
        if(datasnapshot.child(codigo).exists()){
            if(datasnapshot.child(codigo+'/Users').val()){
                var exist = false;
                datasnapshot.child(codigo+'/Users').forEach(function(user){
                    if(user.key==id){
                        exist = true;
                    }
                });
                if(exist){
                    var toast = new Toasty();
                    toast.show("Ya usates este codigo",2000);
                }else{
                    datasnapshot.ref.child(codigo+'/Users/'+id).set(true);
                    setGoldenCupon();
                }

            }else{
                datasnapshot.ref.child(codigo+'/Users/'+id).set(true);
                setGoldenCupon();
            }
        }else{
            var toast = new Toasty();
            toast.show("El Codigo no existe",2000);
        }

     });


}
function setGoldenCupon(){
    var ref = database.ref('Usuarios/'+id+'/Cupones');
    ref.once('value', function(datasnapshot){
        var pos = 0;
        if(datasnapshot.exists()){
            pos = datasnapshot.numChildren();
        }
        datasnapshot.ref.child(pos.toString()+'/value').set(33);
        datasnapshot.ref.child(pos.toString()+'/state').set(true);
        var toast = new Toasty();
        toast.show("Felicidades!! acabas de obtener el CUPON DORADO<br>Canjealo ya",3000);

    });
}
function hideCodCont(){
    document.getElementById('alert').style.display = "none";
}

function getCodigoView(titulo){
    var cont = '<div class="codigo_cont"><button class="closeLeft" onclick="hideCodCont()"></button><h1>';
    cont += titulo;
    cont += '</h1><input id="cod_input" type="text/plain" placeholder="Aqui" name=""><button id="ok_cod">Comprobar</button></div>';
    return cont;
}
function getUrlQuery(){
    var url = window.location.href;
    var queryString = url.split('?')[1];
    if(queryString){
        var obj = {};
        queryString = queryString.split('#')[0];
        var arr = queryString.split('&');
    for (var i=0; i<arr.length; i++) {
        var a = arr[i].split('=');
        var paramNum = undefined;
        var paramName = a[0].replace(/\[\d*\]/, function(v) {
            paramNum = v.slice(1,-1);
            return '';
        });
        var paramValue = typeof(a[1])==='undefined' ? true : a[1];
        if (obj[paramName]) {
            if (typeof obj[paramName] === 'string') {
                obj[paramName] = [obj[paramName]];
            }
            if (typeof paramNum === 'undefined') {
            obj[paramName].push(paramValue);
            }
            else {
            obj[paramName][paramNum] = paramValue;
            }
        }
        else {
            obj[paramName] = paramValue;
        }
        }
        return obj;

    }else{
        return null;
    }

}
function setup(){
        fromMob = detectDevice();

        if(!fromMob){
                document.getElementById("mainMenu").onmouseout = closeMenuMain;
                document.getElementById("mainMenu").onmouseover = showMenuMain;
        }


        dias = new Array();
        var domingo = new dia(1, "Domingo");
        var lunes = new dia(2, "Lunes");
        var martes = new  dia(3, "Martes");
        var miercoles = new dia(4, "Miercoles");
        var jueves = new dia(5, "Jueves");
        var viernes = new dia(6, "Viernes");
        var sabado = new dia(7, "Sabado");
        dias.push(domingo);
        dias.push(lunes);
        dias.push(martes);
        dias.push(miercoles);
        dias.push(jueves);
        dias.push(viernes);
        dias.push(sabado);
        var d = new Date();
        horaActual = d.getHours();
        diaActual = d.getDay();
        diaActual ++;
        if(horaActual>=13){
            diaRequested = diaActual +1;
            if(diaRequested>7){
                diaRequested = 1;
            }
            }else{
                diaRequested = diaActual;
            }
            document.getElementById("dia").innerHTML = dias[diaRequested-1].dia;
            document.getElementById("hamButton").addEventListener("click", showMenuMain);

            var d = new Date();
            categoria = 'Para Desayunar';
            firebase.auth().onAuthStateChanged(function(us) {
                if (us!=null) {
                    user = us;
                    id = user.displayName;
                    photoUrl = user.photoURL;
                    document.getElementById("sessionPhoto").src = photoUrl;

                    document.getElementById("sessionPhone").innerHTML= user.email;

                    document.getElementById("subTitle").addEventListener("click", showMenuMain);
                    var str = id.split(" ");
                    if(fromMob){
                         document.getElementById("salute").innerHTML = "Hola "+str[0]+"<br>elige lo que quieres probar";
                    }else{
                         document.getElementById("salute").innerHTML = "Hola "+str[0]+"<br>elige lo que quieres probar";
                    }
                    cargarData();
                }else{
                    id = getCooKie();
                    if(id==""||id==null){
                        grabarAnon();
                    }
                    document.getElementById("subTitle").addEventListener("click", showAuthDialog);
                    cargarData();

                }

            });
}
function grabarAnon(){
        var d = new Date();
        id = "Anon/"+d.getDay().toString()+d.getMilliseconds().toString()+d.getMinutes().toString()+d.getYear().toString()+d.getMonth().toString()

        d.setTime(d.getTime() + (30*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = "anonMedialuna" + "=" + id + ";" + expires + ";path=/";
}
function getCooKie(){

        var name = "anonMedialuna" + "=";
        var decodedCookie = decodeURIComponent(document.cookie);

        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {

                return c.substring(name.length, c.length);

            }
        }

        return "";
}
function detectDevice(){

        if( navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)
             ){
                if(navigator.userAgent.match(/Android/i)
                || navigator.userAgent.match(/webOS/i)){

                }else{
                    document.getElementById("banner").style.display = "none";
                }
                return true;

            }
            else {
                return false;
            }
}
function setCss(filename){
        var head = document.getElementsByTagName('head')[0];

        var style = document.createElement('link');
        style.href = filename;
        style.type = 'text/css';
        style.rel = 'stylesheet';
        head.append(style);

        return true;
}

function autenticarGoogle(){

            autenticando   = true
            document.getElementById("alert").style.display="none";
            var provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider).then(function(result) {

            user = result.user;

            anon  = id;
            photoUrl = result.user.photoURL;
            var str = user.displayName.split(" ");
            document.getElementById("salute").innerHTML = "Hola "+str[0];
            checkForUser();

            }).catch(function(error) {

            var errorCode = error.code;
            var errorMessage = error.message;

            var email= error.email;

            var credential = error.credential;


            });

}
function checkForUser(){
    if(user!= null){
        var ref = database.ref('Usuarios/'+user.displayName);
        ref.once('value', function(snapshot){
            if(snapshot.exists()){

                if(snapshot.child('Marchante').exists){
                        marchante = snapshot.child('Marchante').val();
                }
                document.getElementById("notification").style.display = "none";
                if(snapshot.child('Notificacion').exists){
                    notificaciones = new Array();
                    document.getElementById("notification").style.display = "block";
                    var time = '';
                    snapshot.child('Notificacion').forEach(function(noti){
                        if(noti.val().time!=time){
                            if(noti.child('state').exists&&parseInt(noti.child('state').val(),10)==0){
                                var titulo = noti.child('titulo').val();
                                var cuerpo = noti.child('cuerpo').val();
                                var state = parseInt(noti.child('state').val(), 10);
                                var accion = parseInt(noti.child('action').val(), 10);
                                var not = new notificacion(noti.key, titulo, cuerpo, state, accion);
                                time = noti.val().time;
                                if(state==0){
                                    notificaciones.push(not);
                                }
                            }
                        }else{
                            noti.ref.remove();
                        }


                    });
                    if(notificaciones.length>0){
                        document.getElementById("verNotificaciones").style.display = "flex";
                        document.getElementById("notification").innerHTML = notificaciones.length;
                        document.getElementById("counter").innerHTML = notificaciones.length;
                        document.getElementById("counter").style.display = "none";
                    }else{
                        document.getElementById("notification").style.display = 'none';
                        document.getElementById("verNotificaciones").style.display = "none";
                        document.getElementById("counter").style.display = "none";
                    }
                }else{
                    document.getElementById("notification").style.display = "none";
                    document.getElementById("verNotificaciones").style.display = "none";
                    document.getElementById("counter").style.display = "none";
                }
                id = user.displayName;
                ref.child('things/devices/web').set(true);
                if(!notPermission){
                    Notification.requestPermission(function(status) {

                            notPermission = true;
                            if(messaginToken==null){
                                    if(!reginPush){
                                        reginPush = true;
                                        regPushWorker();
                                    }else{
                                        showWin();
                                    }

                            }else{
                                showWin();
                            }
                    });
                }else {
                    if(messaginToken==null){
                        if(!reginPush){
                            reginPush = true;
                            regPushWorker();
                        }else{
                            showWin();
                        }

                    }else{
                        showWin();
                    }
                }

            }else{
                checkFromDeleted();
            }
        });
    }else{
        checkDay();
    }
}
function checkNotis(){
    var ref = database.ref('Usuarios/'+id);
    ref.once('value', function(snapshot){
        if(snapshot.child('Notificacion').exists){
            notificaciones = new Array();
            document.getElementById("notification").style.display = "block";
            var time = '';
            snapshot.child('Notificacion').forEach(function(noti){
                if(noti.val().time != time){
                    if(noti.child('state').exists&&parseInt(noti.child('state').val(),10)==0){
                        var titulo = noti.child('titulo').val();
                        var cuerpo = noti.child('cuerpo').val();
                        var state = parseInt(noti.child('state').val(), 10);
                        var accion = parseInt(noti.child('action').val(), 10);
                        var not = new notificacion(noti.key, titulo, cuerpo, state, accion);
                        time = noti.val().time;
                        if(state==0){
                            notificaciones.push(not);
                        }

                    }
                }else{
                    noti.ref.remove();
                }


            });
            if(notificaciones.length>0){
                document.getElementById("verNotificaciones").style.display = "flex";
                document.getElementById("notification").innerHTML = notificaciones.length;
                document.getElementById("counter").innerHTML = notificaciones.length;
                document.getElementById("counter").style.display = "block";
            }else{
                document.getElementById("notification").style.display = 'none';
                document.getElementById("verNotificaciones").style.display = "none";
                document.getElementById("counter").style.display = "none";
            }
        }else{
            document.getElementById("notification").style.display = "none";
            document.getElementById("verNotificaciones").style.display = "none";
            document.getElementById("counter").style.display = "none";
        }
    });
}
function checkFromDeleted(){
        var ref=database.ref('Deleted/'+user.displayName);
        ref.once('value',function(snapshot){
            if(snapshot.exists()){
                regNewUser(false);
            }else{

                regNewUser(true);
            }
        });
}
function regNewUser(darCupones){

        var ref = database.ref('Usuarios/'+user.displayName);
        var percent = 10;
                if(darCupones){
                    for(var i = 0; i<5;i++){
                    ref.child('Cupones/'+i+'/value').set(percent);
                    ref.child('Cupones/'+i+'/state').set(true);
                    percent = percent+5;
                    }
                }
                ref.child('things/devices/web').set(true);
                ref.child('things/UidEntiFyDeco').set(user.uid);


                ref.child('things/email').set(user.email);
                ref.child('things/nick').set(user.displayName);
                ref.child('things/telefono').set("");
                if(marchante!=""){
                    ref.child('Marchante').set(marchante);
                }
                ref.child('things/PhotoUrl').set(user.photoURL);
                getOrdenFromAnon();

}
function getOrdenFromAnon(){

            var ref = database.ref('Usuarios/'+anon);
            ref.once('value', function(snapshot){

                if(snapshot.exists()){

                    try{
                    var ordenesList = new Array();
                    snapshot.child('Suscripcion/Dia').forEach(function(dia){
                        var hora = false;
                        if(dia.child('Hora de entrega').exists()){
                           hora = parseInt(dia.child('Hora de entrega').val(), 10);
                        }


                        var total = parseInt(dia.child('Total').val(), 10);
                        var domicilio = parseInt(dia.child('domicilio').val(), 10);
                        var totalDescontado;
                        if(dia.child('totalDescontado').exists()){
                            totalDescontado = parseInt(dia.child('totalDescontado').val(), 10);
                        }else{
                            totalDescontado = 0;
                        }

                        var estado = "si";
                        var status = 0;
                        var prods= new Array();
                        dia.child('Productos').forEach(function(producto){
                            var tipo = parseInt(producto.child('tipo').val(),10);
                            var descripcion = producto.child('descripcion').val();
                            var can = parseInt(producto.child('cantidad').val(), 10);
                            var totalProd = parseInt(producto.child('total').val(), 10);
                            var webUrl = producto.child('weburl').val();
                            var url = producto.child('url').val();
                            var uri = 0;
                            var nombre =  producto.key;
                            var caritem = new carItem(nombre,
                                descripcion,
                                tipo,
                                can,
                                totalProd,
                                webUrl,
                                url,
                                uri);
                            prods.push(caritem);


                        });

                            var ord = new orden(hora, "no", total, domicilio, totalDescontado, estado, status, prods);
                            var ordendia = new ordenDia(dia.key, ord);
                            ordenesList.push(ordendia);



                    });





                    orden_dia.grabarOrden(ordenesList);
                   }catch(err){

                   }




                }
                else{

                }

            });
}
function regPushWorker(){
    messaging.requestPermission().then(function() {

                messaging.getToken().then(function(currentToken) {
                    if (currentToken) {
                        messaginToken = currentToken;

                        messaging.onMessage(function(payload){
                            if (Notification.permission == 'granted') {
                                navigator.serviceWorker.getRegistration().then(function(reg) {
                                   sw = reg;
                                   notify(payload);
                                });
                            }else{
                                Notification.requestPermission(function(status) {
                                    if(status = 'granted'){
                                        navigator.serviceWorker.getRegistration().then(function(reg) {
                                            sw = reg;
                                            notify(payload);
                                        });
                                    }

                                });
                            }
                        });
                        subscribeUser();

                    } else {

                    }
                }).catch(function(err) {
                    console.log('An error occurred while retrieving token. ', err);
                });
    }).catch(function(err) {
        console.log('Unable to get permission to notify.', err);
    });

}

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
function subscribeUser(){
    sw.pushManager.getSubscription().then(function(subscription) {
        var isSubscribed = false;
        if(subscription!=null){
            isSubscribed = true;
        }
        if (isSubscribed) {


            if(fromMob){
                database.ref('NotTokens/'+user.displayName+'/MobToken').set(messaginToken);
            }else{
                database.ref('NotTokens/'+user.displayName+'/WebToken').set(messaginToken);
            }

            showWin();

        }else{
            var applicationServerKey = urlB64ToUint8Array(
                    'BI0o6fQgh69SzBlKpPM28I5dZoFMj5P3A1uovm_egzMCBaYMkB-djaC7FXsfZJX5HV4Tz0CZFIsEbu02iB_9xpA'
            );
            const subscribeOptions = {
                userVisibleOnly: true,
                applicationServerKey: applicationServerKey
            };
            sw.pushManager.subscribe(subscribeOptions).then(function(subscription) {

                isSubscribed = true;
                if(fromMob){
                    database.ref('NotTokens/'+user.displayName+'/MobToken').set(messaginToken);
                }else{
                    database.ref('NotTokens/'+user.displayName+'/WebToken').set(messaginToken);
                }
                showWin();


            }).catch(function(err) {

            });

        }


    });
}
function showWin(){
    if(windState==1){
        verCanasta();
    }else if(windState == 0){
        checkDay();
    }
}
var showingNots = false;
function verNotificaciones(){
    if(!showingNots){
        showingNots = true;
        document.getElementById("alert").style.display = "block";
        document.getElementById("notificaciones").style.display = "block";
        var cont = '';
        for(var i=0; i<notificaciones.length;i++){
                cont += '<li onclick="notiAction('+i+')"><h1>';
                cont += notificaciones[i].titulo;
                cont += '</h1><h2>';
                cont += notificaciones[i].cuerpo;
                cont += '</h2></li>';

        }
        document.getElementById("notifications_list").innerHTML = cont;
    }

}
function notiAction(pos){

    var ref = database.ref('Usuarios/'+id+'/Notificacion/'+notificaciones[pos].key);
    ref.remove();
    document.getElementById("notificaciones").style.display = "none";
    document.getElementById("alert").style.display = "none";
    checkNotis();
    closeMenuMain();
}
function cerrarNotis(){

    showingNots = false;
    setTimeout(close, 2000);
    function close(){
        if(!showingNots){
            document.getElementById("notificaciones").style.display = "none";
        }

    }


}
function cargarData(){

        if(!fromMob){

                document.getElementById("mainTitle").innerHTML= "";
                document.getElementById("mainTitle").style.padding = 0;
                document.getElementById("mainTitle").style.backgroundImage = "url('src/icons/title.png')";
                if(user!=null){
                    document.getElementById("subTitle").innerHTML = user.displayName;
                    document.getElementById("sessionUser").innerHTML = user.displayName;
                    document.getElementById("sessionHead").style.display = "block";

                    document.getElementById("cerrarSesion").style.display= "flex";
                    document.getElementById("removerCuenta").style.display = "flex";
                }else{
                    document.getElementById("subTitle").innerHTML = "Iniciar Sesión";
                }
                document.getElementById("hamButton").style.backgroundImage = "url('src/icons/ham_icon_orange.png')";

        }else{
             document.getElementById("hamButton").style.backgroundImage = "url('src/icons/ham_icon_black.png')";
             document.getElementById("subTitle").style.display ="none";
             document.getElementById("mainTitle").innerHTML=dias[diaRequested-1].dia;
              document.getElementById("mainTitle").addEventListener("click", function(){
                verTallo(true);
            });
        }
        if(user!=null){
                photoUrl = user.photoURL;
                document.getElementById("menuButton").style.backgroundSize = "cover";
                document.getElementById("menuButton").style.backgroundImage = "url('"+photoUrl+"')";
                document.getElementById("menuButton").addEventListener("click", showMenuMain);
                document.getElementById("sessionUser").innerHTML = user.displayName;
                document.getElementById("sessionHead").style.display = "block";
                document.getElementById("cerrarSesion").style.display= "flex";
                document.getElementById("removerCuenta").style.display = "flex";
                document.getElementById("subTitle").addEventListener("click", showMenuMain);
        }else{
                document.getElementById("menuButton").style.backgroundSize = "cover";
                if(fromMob){
                    document.getElementById("menuButton").style.backgroundImage = "url('src/icons/usu.png')";

                }else{
                    document.getElementById("menuButton").style.backgroundImage = "url('src/icons/usu_orange.png')";

                }

                document.getElementById("menuButton").addEventListener("click", showAuthDialog);
        }
        document.getElementById("loading").style.display = "none";

        tienda.cargarProductos(categoria);
}
function removerCuenta(){
        document.getElementById("mainMenu").style.display = "none";
        document.getElementById("alert").style.display = "none";
        cancelCloseMain = false;
        showingMenuMain = false;
        var dialog = viewDialog("¿Estas segur@?", "Al continuar se borrarán todos tus datos, incluyendo ordenes guardadas y ubicaciones", "src/icons/zero_img.png");
        document.getElementById("alert").innerHTML = dialog;
        document.getElementById("alert").style.display = "block";
        document.getElementById("yesBtn").innerHTML = "Continuar";
        document.getElementById("yesBtn").addEventListener("click", function(){
            document.getElementById("alert").style.display = "none";
            var reflast = database.ref('Deleted/'+id);
            reflast.set(true);
            var ref = database.ref('Usuarios/'+id);
            ref.remove();
            cerrarSesion();
        });
        document.getElementById("noBtn").innerHTML= "Cancelar";
        document.getElementById("yesBtn").style.marginLeft= "0vw";
        document.getElementById("noBtn").style.marginLeft= "0vw";
        document.getElementById("noBtn").addEventListener("click", function(){
            document.getElementById("alert").style.display = "none";

        });
}



function displayNotification() {
  if (Notification.permission == 'granted') {
    navigator.serviceWorker.getRegistration().then(function(reg) {
        var options = {
          body: 'Here is a notification body!',
          icon: 'src/logo.png',
          vibrate: [100, 50, 100],
          data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
          }
        };
        reg.showNotification('Hello world!');
    });
  }
}
function notify(data){
    var data = payload;
    if(data.data.actions){
        var acts = JSON.parse(data.data.actions);

        data.data.actions = acts;
    }

    vibrate= [30,5,60,8,90];
    data.data.vibrate = vibrate;
    data.data.renotify = true;
    data.data.color = '#FFFFFF';
    data.data.tag = 'medialuna';
    data.data.data = data.data;
    sw.showNotification(data.data.title, data.data);

}
function sendMessage(){
    var actions = [{action: 'opt1',title: 'open notification'}];
    database.ref("Notificaciones").push({
        token:messaginToken,
        data:{
            data:{
                title: 'Recuerda Comprar y Comprar',
                body: 'Elige los mejores productos\nsolo aqui en tu panaderia\nvirtual admirate por todo\nlo que se ha creado',
                icon: "src/icons/notification_icon_mob.png",
                click_action: '/index.html',
                priority: 'normal',
                actions: JSON.stringify(actions)

            }

        }


    });
    showWin();
}





function goMain(){
        console.log('gomain');
        windState = 0;
        isCanastaShowing = false;
        document.getElementById("ticket").style.display = "none";
        document.getElementById("cupones").style.display = "none";
        document.getElementById("container").style.display = "block";
        document.getElementById("container").style.left = "0vw;"
        document.getElementById("diaContainer").style.display = "none";
        var menuBtn = document.getElementById("menuButton");
        var mainMenu = document.getElementById("hamButton");
        var title = document.getElementById("mainTitle");

        document.getElementById("header").innerHTML = "";



        var newMenu = document.createElement('button');
        var newMain = document.createElement('button');
        var newTitle = document.createElement('h1');
        var newLogo = document.createElement('img');
        var subTitle = document.createElement('h2')
        var newSecond = document.createElement('button');
        var noti = document.createElement('h3');
        noti.setAttribute('id', 'notification')
        newSecond.setAttribute('id', 'secondary');
        newLogo.setAttribute('id', 'logoHead');
        newMenu.setAttribute('id', 'menuButton');
        newTitle.setAttribute('id', 'mainTitle');
        newMain.setAttribute('id', 'hamButton');
        newLogo.src = "src/icons/orden_logo.png";
        subTitle.setAttribute('id', 'subTitle');
        noti.style.display = 'none';


        document.getElementById("header").appendChild(newMain);
        document.getElementById("header").appendChild(newLogo);
        document.getElementById("header").appendChild(noti);

        document.getElementById("header").appendChild(newTitle);
        document.getElementById("header").appendChild(newSecond);
        document.getElementById("header").appendChild(subTitle);
        document.getElementById("header").appendChild(newMenu);

        document.getElementById("hamButton").addEventListener("click", showMenuMain);
        document.getElementById("secondary").addEventListener("click", function(){
            verTallo(true);
        });

        if(fromMob){
            document.getElementById("menuButton").style.backgroundImage = "url('src/icons/usu.png')";
            document.getElementById("mainTitle").style.textAlign = "center";
            document.getElementById("mainTitle").style.width = "50vw";
            document.getElementById("mainTitle").innerHTML= dias[diaRequested-1].dia;
            document.getElementById("mainTitle").addEventListener("click", function(){
                verTallo(true);
            });
            document.getElementById("hamButton").style.backgroundImage = "url('src/icons/ham_icon_black.png')"
        }else{
            document.getElementById("menuButton").style.backgroundImage = "url('src/icons/usu_orange.png')";
            document.getElementById("mainTitle").style.textAlign = "left";
            document.getElementById("mainTitle").style.marginLeft = "12vw";
            document.getElementById("mainTitle").innerHTML= "";
            document.getElementById("mainTitle").style.backgroundImage = "url('src/icons/title.png')";
            document.getElementById("mainTitle").style.padding = 0;
            document.getElementById("hamButton").style.backgroundImage = "url('src/icons/ham_icon_orange.png')"
        }

        if(user!=null){
            document.getElementById("subTitle").innerHTML = id;

             document.getElementById("subTitle").addEventListener("click", showMenuMain);
             document.getElementById("menuButton").style.backgroundImage = "url('"+user.photoURL+"')";
             document.getElementById("subTitle").addEventListener("click", showMenuMain);
             document.getElementById("menuButton").addEventListener("click", showMenuMain);
        }else{
            document.getElementById("subTitle").innerHTML = "Iniciar Sesión";
            document.getElementById("subTitle").addEventListener("click", showAuthDialog);
            document.getElementById("menuButton").addEventListener("click", showAuthDialog);
        }
        setDotListener();
        requestDia(dias[diaRequested-1].day);
}
function showCanasta(){

            if(fromMob){
                var pos = 0;
                 var maskPos = -26;
                var anim = setInterval(frame, 10);
                document.getElementById('canasta').style.bottom = pos+"vw";
                document.getElementById('mask').style.bottom = pos+"vw";
                document.getElementById('canasta').style.display = "block";
                document.getElementById('mask').style.display = "block";
                function frame(){
                    if(pos>=22){
                        clearInterval(anim);
                        isCanastaShowing = true;
                        document.getElementById("cargandoProds").style.display="none";
                        return true;
                    }else{
                        pos= pos +1;
                        maskPos= maskPos+ 1;
                        document.getElementById('canasta').style.bottom = pos+"vw";
                        document.getElementById('mask').style.bottom = maskPos+"vw";
                    }
                }
            }else{
                var pos = 0;
                var maskPos = -6;
                var anim = setInterval(frame, 10);
                document.getElementById('canasta').style.bottom = pos+"vw";
                document.getElementById('mask').style.bottom = pos+"vw";
                document.getElementById('canasta').style.display = "block";
                document.getElementById('mask').style.display = "block";
                function frame(){
                    if(pos>=4){
                        clearInterval(anim);
                        isCanastaShowing = true;
                        document.getElementById("cargandoProds").style.display="none";
                        return true;
                    }else{
                        pos= pos +1;
                        maskPos= maskPos+ 1;
                        document.getElementById('canasta').style.bottom = pos+"vw";
                        document.getElementById('mask').style.bottom = maskPos+"vw";
                    }
                }
            }




}
function hideCanasta(){
        if(isCanastaShowing){
            if(fromMob){
                var pos =22;
                var maskPos = -4;
                var anim = setInterval(frame, 10);

                function frame(){
                    if(pos<=0){
                        clearInterval(anim);
                        document.getElementById('canasta').style.display = "none";
                        document.getElementById('mask').style.display = "none";
                    }else{
                        pos= pos -1;
                        maskPos= maskPos- 1;
                        document.getElementById('canasta').style.bottom = pos+"vw";
                        document.getElementById('mask').style.bottom = maskPos+"vw";
                    }
                }
            }else{
                var pos =4;
                var maskPos = -2;
                var anim = setInterval(frame, 10);

                function frame(){
                    if(pos<=0){
                        clearInterval(anim);
                        document.getElementById('canasta').style.display = "none";
                        document.getElementById('mask').style.display = "none";
                    }else{
                        pos= pos -1;
                        maskPos= maskPos- 1;
                        document.getElementById('canasta').style.bottom = pos+"vw";
                        document.getElementById('mask').style.bottom = maskPos+"vw";
                    }
                }
            }

        }
        return false;
}
function verTallo(show){
        if(show){
            document.getElementById("diasList").style.display = "block";
            compararDias();
        }else{
            document.getElementById("diasList").style.display = "none";
        }
}
function verCanasta(){
        windState = 1;

        isCanastaShowing = false;

        var mainMenu = document.getElementById("hamButton");
        var menuBtn = document.getElementById("menuButton");
        var title = document.getElementById("mainTitle");
        var logo = document.getElementById("logoHead");
        var noti = document.getElementById("notification");
        var second = document.getElementById("secondary");
        document.getElementById("header").innerHTML = "";

        var newMenu = document.createElement('button');
        var newTitle = document.createElement('h1');

        newTitle.setAttribute('id', 'mainTitle');


        newMenu.setAttribute('id', 'menuButton');
        var newMain = document.createElement('button');
        newMain.setAttribute('id','hamButton');
        document.getElementById("header").appendChild(newMain);
        document.getElementById("header").appendChild(newTitle);
        document.getElementById("header").appendChild(newMenu);


        document.getElementById("mainTitle").innerHTML = dias[diaRequested-1].dia ;
        document.getElementById("mainTitle").style.textAlign = "center";



        document.getElementById("menuButton").removeEventListener("click", showAuthDialog);
        document.getElementById("menuButton").addEventListener("click", orden_dia.removeDia);
        document.getElementById("mask").style.display = "none";


        document.getElementById("canasta").style.display = "none";
        document.getElementById("hamButton").addEventListener("click", tienda.verProductos);
        if(fromMob){
            document.getElementById("menuButton").style.backgroundImage = "url('src/icons/cancel_btn.png')";
            document.getElementById("hamButton").style.backgroundImage = "url('src/icons/btn_back_arrow.png')";
            document.getElementById("mainTitle").style.width = "68vw";
        }else{
            document.getElementById("mainTitle").style.marginLeft = "8vw";
            document.getElementById("menuButton").style.backgroundImage = "url('src/icons/cancel_btn_orange.png')";
            document.getElementById("hamButton").style.backgroundImage = "url('src/icons/btn_back_arrow_orange.png')";
        }
        document.getElementById("container").style.display = "none";
        document.getElementById("diaContainer").style.display = "block";
        getCupones(false);
}

function verPerfil(){
       document.getElementById("sessionUser").innerHTML = id;
       document.getElementById("sessionPhoto").src = user.photoURL;
}
function showMenuMain(){
    if(user!=null){
            photoUrl = user.photoURL;
            document.getElementById("menuButton").style.backgroundSize = "cover";
            document.getElementById("menuButton").style.backgroundImage = "url('"+photoUrl+"')";
            document.getElementById("menuButton").addEventListener("click", showMenuMain);
            document.getElementById("sessionUser").innerHTML = user.displayName;
            document.getElementById("sessionHead").style.display = "block";
            document.getElementById("cerrarSesion").style.display= "flex";
            document.getElementById("removerCuenta").style.display = "flex";
            document.getElementById("subTitle").addEventListener("click", showMenuMain);
        }else{
            document.getElementById("menuButton").style.backgroundSize = "cover";
            if(fromMob){
                document.getElementById("menuButton").style.backgroundImage = "url('src/icons/usu.png')";

            }else{
                document.getElementById("menuButton").style.backgroundImage = "url('src/icons/usu_orange.png')";

            }

            document.getElementById("menuButton").addEventListener("click", showAuthDialog);
        }
        cancelCloseMain = false;
        if(fromMob){
            document.getElementById("alert").innerHTML = "";
            document.getElementById("alert").style.display ="block";
            document.getElementById("mainMenu").style.display = "block";
            document.getElementById("mainMenu").style.marginLeft = '0vw';

        }else{
            if(!showingMenuMain){

                var pos;

                pos= -25;
                document.getElementById("mainMenu").style.display = "block";
                var anim = setInterval(frame, 4);
                function frame(){
                    if(pos>=-1){
                        clearInterval(anim);
                        showingMenuMain= true;
                        document.getElementById("mainMenu").style.marginLeft = pos + 'vw';
                         document.getElementById("alert").innerHTML = "";
                        document.getElementById("alert").style.display ="block";
                    }else{
                        pos = pos+2;
                        document.getElementById("mainMenu").style.marginLeft = pos + 'vw';
                    }
                }
            }else{
                document.getElementById("mainMenu").style.marginLeft = -1 + 'vw';
            }
        }
}
function closeMenuMain(){

        if(fromMob){
             document.getElementById("alert").style.display ="none";
            document.getElementById("mainMenu").style.marginLeft ='-64vw';

             document.getElementById("mainMenu").style.display = "none";
        }else{
             if(showingMenuMain){
                cancelCloseMain = true;
                var timeOutClose = setTimeout(hide, 2000);
                function hide(){
                      if(cancelCloseMain){
                            if(showingMenuMain){
                                var pos =-1;
                                var anim = setInterval(frame, 4);
                                function frame(){
                                    var limit;
                                    limit = -25;
                                    if(pos<=limit){
                                        clearInterval(anim);
                                        clearTimeout(timeOutClose);
                                        showingMenuMain = false;
                                        document.getElementById("mainMenu").style.display = "none";
                                        document.getElementById("alert").innerHTML = "";
                                        document.getElementById("alert").style.display ="none";
                                    }else{
                                        pos = pos-2;
                                        document.getElementById("mainMenu").style.marginLeft = pos + 'vw';
                                    }
                                }
                            }else{
                                clearTimeout(timeOutClose);
                            }
                      }else{

                      }
                }
             }
        }
}
function showSessionMenu(){

            var pos;
            if(fromMob){

                    document.getElementById("session").style.display = "block";
                    document.getElementById("session").style.left = "0vw";
                    showingSessionMenu = true;
                    verPerfil();



            }else{

                 pos = -28;
                 cancelCloseSessionMenu = false;
                 if(!showingSessionMenu){
                    showingSessionMenu = true;
                    var anim = setInterval(frame, 4);
                    document.getElementById("session").style.display = "block";
                    function frame(){
                        if(pos==0){
                            clearInterval(anim);
                            showingSessionMenu = true;
                            document.getElementById("alert").style.display="block";
                             document.getElementById("alert").innerHTML ="none";
                            verPerfil();
                        }else{
                            pos= pos+2;
                            document.getElementById("session").style.right = pos+"vw";
                        }
                    }
                }else{
                    document.getElementById("session").style.right = 0 +"vw";
                }
            }
}
function hideSessionMenu(){
        if(showingSessionMenu){
            if(!fromMob){
                cancelCloseSessionMenu = true;
                var anim= setTimeout(hide, 3000);
                function hide(){
                    if(cancelCloseSessionMenu){
                        if(showingSessionMenu){
                            var pos =0;
                            var anim = setInterval(frame, 2);
                            function frame(){
                                if(pos<=-28){
                                    clearInterval(anim);
                                    clearTimeout(anim);
                                    showingSessionMenu = false;
                                    document.getElementById("alert").style.display="none";
                                    document.getElementById("session").style.display = "none";
                                }else{
                                    pos = pos-2;
                                    document.getElementById("session").style.right= pos + 'vw';
                                }
                        }
                    }else{
                        clearTimeout(anim);
                    }
                }
                }
            }else{
                cancelCloseSessionMenu = true;
                showingSessionMenu = false;
                document.getElementById("session").style.display = "none";
            }

        }
}
function cerrarSesion(){
        firebase.auth().signOut().then(function() {
            document.getElementById("session").style.display = "none";
            location.reload(true);
        }).catch(function(error) {

        });
}
function cerrarAlert(pos, agregando){
        authChecked = false;
        if(!agregando){
            tienda.productos[pos].tipo = 0;
            document.getElementById("alert").style.display= "none";
        }else{
            document.getElementById("alert").style.display= "none";
        }

        if(editandoItem){
            editandoItem = false;
            reserva(dias[diaRequested-1].dia);
        }
}




var playingQuery = false;


function playQuery(){
    playingQuery = true;
    switch(query.action){
        case '0':
            if(query!=null){

                abrirDiaDesdeNotificacion();
            }
            break;
        case '1':
            if(query!=null){

                abrirPublicacion();
            }
            break;
        case '2':
            initEngine();
            break;

    }
}
function abrirDiaDesdeNotificacion(){
    actualDia = parseInt(query.day, 10);


    var ref = database.ref('Usuarios/'+id+'/Notificacion');
    ref.once('value', function(snapshot){
        snapshot.forEach(function(not){
            if(not.val().time==query.notId){
                not.ref.remove();
            }
        });
        query = null;
        requestDia(actualDia);


    });
}
function abrirPublicacion(){
    var pubId = query.notId;
    var ref = database.ref('Muro/publicaciones/'+pubId);
    ref.once('value', function(snapshot){
        var liked = false;
        snapshot.child('likes/us').forEach(function(snapshot){

            var me = id.split("/");
            var meString = "";
            if(me.length>1){
                meString = me[1];
            }else{
                meString = me[0];
            }
            if(snapshot.key==meString){
                liked = true;
            }

        });
        var cont =  cargarSharedPubView(snapshot.val(), snapshot.key, liked);
        document.getElementById("alert").innerHTML = "";
        document.getElementById("alert").innerHTML = cont;
        document.getElementById("alert").style.display = "block";

    });

}
function cerrarPub(){
    document.getElementById("alert").innerHTML = "";
    document.getElementById("alert").style.display = "none";
    window.open("https://today-6648d.firebaseapp.com","_self");

}
function cargarSharedPubView(publicacion, key, liked){
    var cont = '<div id="shared_pub"><button onclick="cerrarPub()"class="close_rigth"></button><img src="';
    cont += publicacion.url;
    cont += '"><h1>';
    cont +=publicacion.name;
    cont +='</h1><p>';
    cont +=publicacion.contenido;
    cont += '</p><div ><h2>';
    cont += publicacion.likes.count;
    cont += '</h2><button style="background-image: url('+"'src/icons/icono_reserva.png'";
    var url = generatePubUrl(key);
    console.log(url);
    cont += ')"></button><h3 ';





    if(!liked){
        cont += 'onclick="like('+"'"+key+"'"+', 1)"';
    }else{
        cont += 'style="background-color: #d4d4d6"';
    }
     cont +='>Me gusta</h3><button onclick="shareInt('+"'"+url.toString()+"'"+",'Hola, dale Me gusta y antojate tu tambien'"+')" style="background-image: url('+"'src/icons/share.png'"+')"></button></div><h4>dialogo</h4></div>';

     return cont;
}
function carItem(nombre, descripcion, tipo, cantidad, total, weburl, url, uri){
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.tipo = tipo;
        this.total = total;
        this.weburl = weburl;
        this.url = url;
        this.uri = uri;
        this.cantidad = cantidad;

}
function checkDay(){
        var ref = database.ref('Usuarios/'+id+'/Suscripcion/Dia/'+dias[diaRequested-1].dia);
        ref.once('value', function(snapshot){
            if(snapshot.child('estado').exists()){
                if(snapshot.child('estado').val()=="confirmando"||snapshot.child('estado').val()=="espera"){
                    confirmando = true;
                }else{
                    confirmando = false;
                }
                if(snapshot.child('Total').exists()){

                    if(snapshot.child('Productos').exists()){
                        var total = parseInt(snapshot.child('Total').val(), 10);
                        var dom= getDomicilio(total);
                        if(snapshot.child('Cupon').exists()){
                            var discount = parseInt(snapshot.child('Cupon/valor').val(), 10);
                            total = aplicarDescuento(discount, total);

                            dom = getDomicilio(total);

                        }

                        var content = 'Total + Domicilio  $';
                        var total = total+dom;
                        content += redondearCifra(total);
                        document.getElementById('canastaText').innerHTML = content;
                        var anim = showCanasta();
                        carList = new Array();
                        snapshot.child('Productos').forEach(function(prod){
                            var nombre = prod.key;
                            var can = parseInt(prod.child('cantidad').val(), 10);
                            var tipo = parseInt(prod.child('tipo').val(), 10);
                            var descripcion = prod.child('descripcion').val();
                            var total = parseInt(prod.child('total').val(), 10);
                            var webUrl =  prod.child('weburl').val();
                            var url =  prod.child('url').val();
                            var uri =  prod.child('uri').val();
                            var caritem = new carItem(nombre, descripcion, tipo, can, total,webUrl, url, uri );
                            carList.push(caritem);
                        });
                        if(fromDay){
                            compareConProductos();
                        }else{

                            verCanasta();
                        }


                    }else{
                    confirmando = false;
                    var anim = hideCanasta();
                    isCanastaShowing = false;
                    compareConProductos();
                        }
                 }else{
                confirmando = false;
                var anim = hideCanasta();
                isCanastaShowing = false;
                compareConProductos();
                   }
            }else{
                confirmando = false;
                var anim = hideCanasta();
                isCanastaShowing = false;
                tienda.mostrarProductos(false);
            }

        });
}
function compararDias(){
        var day = diaActual;
        if(day>7){
            day = 1;
        }
        for(var i=0;i<dias.length;i++){
            if(dias[i].dia=="Lunes"||dias[i].dia=="Miercoles"||dias[i].dia=="Viernes"||dias[i].dia=="Domingo"){
              document.getElementById(dias[i].dia+"Seed").style.backgroundImage = "url('src/icons/grano_izquierda.png')";
              document.getElementById(dias[i].dia+"State").src = "src/icons/zero_img.png";

            }else{

               document.getElementById(dias[i].dia+"Seed").style.backgroundImage = "url('src/icons/grano_derecha.png')";
                document.getElementById(dias[i].dia+"State").src = "src/icons/zero_img.png";
            }
        }
        if(horaActual>13&&diaActual==diaRequested){
            canToday = false;
            if(dias[day-1].dia=="Lunes"||dias[day-1].dia=="Miercoles"||dias[day-1].dia=="Viernes"||dias[day-1].dia=="Domingo"){
                document.getElementById(dias[day-1].dia+"Seed").style.backgroundImage = "url('src/icons/grano_izquierda_null.png')";
            }else{
               document.getElementById(dias[day-1].dia+"Seed").style.backgroundImage = "url('src/icons/grano_derecha_null.png')";
            }

        }else{
            canToday = true;
        }
        var ref = database.ref('Usuarios/'+id+'/Suscripcion/Dia');
        ref.once('value', function(snapshot){
            if(snapshot.exists()){
                snapshot.forEach(function(dia){
                    if(dia.child('estado').val()=="guardado"){
                        if(dia.key==dias[day-1].dia){
                            canToday = true;
                        }
                        document.getElementById(dia.key+"State").src = "src/icons/candel.png";
                        document.getElementById(dia.key+"State").style.display = "block";
                        if(dia.key=="Lunes"||dia.key=="Miercoles"||dia.key=="Viernes"||dia.key=="Domingo"){
                             document.getElementById(dia.key+"Seed").style.backgroundImage = "url('src/icons/grano_izquierda_ok.png')";

                        }else{
                            document.getElementById(dia.key+"Seed").style.backgroundImage = "url('src/icons/grano_derecha_ok.png')";
                        }

                    }else if(dia.child('estado').val()=="confirmando"||dia.child('estado').val()=="espera"){
                         if(dia.key==dias[day-1].dia){
                            canToday = true;
                        }
                        document.getElementById(dia.key+"State").src = "src/icons/progress_gif.gif";
                        document.getElementById(dia.key+"State").style.display = "block";
                        if(dia.key=="Lunes"||dia.key=="Miercoles"||dia.key=="Viernes"||dia.key=="Domingo"){
                             document.getElementById(dia.key+"Seed").style.backgroundImage = "url('src/icons/grano_izquierda_ok.png')";

                        }else{
                            document.getElementById(dia.key+"Seed").style.backgroundImage = "url('src/icons/grano_derecha_ok.png')";
                        }
                    }else if(dia.child('estado').val()=="si"){

                        document.getElementById(dia.key+"State").src = "src/icons/information_point.png";
                          document.getElementById(dia.key+"State").style.display = "block";
                           document.getElementById(dia.key+"State").addEventListener("click", function(){
                                var tos= new Toasty();
                                tos.show("Pulsa el botón Guardar para registrar tu pedido", 3000);
                                reserva(dia.key);
                           });
                           if(dia.key=="Lunes"||dia.key=="Miercoles"||dia.key=="Viernes"||dia.key=="Domingo"){
                             document.getElementById(dia.key+"Seed").style.backgroundImage = "url('src/icons/grano_izquierda_ok.png')";

                        }else{
                            document.getElementById(dia.key+"Seed").style.backgroundImage = "url('src/icons/grano_derecha_ok.png')";
                        }
                    }
                });
            }
        });
}
function requestDia(dia){

        var day = diaActual;
        if(day>7){
            day = 1;
        }
        var actualDia = dias[day-1].dia;
        if(dia!=diaRequested){
            fromDay=false;
        }
        diaRequested = dia;
        document.getElementById("dia").innerHTML =  dias[diaRequested-1].dia;
        if(fromMob){
            document.getElementById("mainTitle").innerHTML =  dias[diaRequested-1].dia;
        }else{
            document.getElementById("mainTitle").innerHTML = "";
        }
        document.getElementById("diasList").style.display = "none";

        tienda.cargarProductos(categoria);
}
function compareConProductos(){

      var prods = tienda.productos();
        if(isCanastaShowing){
            for(var i=0; i<prods.length;i++){
                    for(var j=0 ; j<carList.length;j++){
                        if(carList[j].nombre == prods[i].nombre){
                            prods[i].isTaken = true;

                        }
                    }
            }
            tienda.setProductos(prods);
            tienda.mostrarProductos(false);


        }else{
            for(var i=0; i<prods.length;i++){

                        prods[i].isTaken = false;


            }
            tienda.setProductos(prods);
            tienda.mostrarProductos(false);
        }
}
function mostrarFoto(foto){
        var cont = '<img class="fotoViewer" onclick="cerrarAlert(0, true)" src="'+tienda.productos()[foto].url+'">';
        document.getElementById("alert").innerHTML = cont;
        document.getElementById("alert").style.display = "block";
}






function reserva(dia){
        hasChossenHour = false;
        var ref = firebase.database().ref('Usuarios/'+id+'/Suscripcion/Dia/'+dia);
        ref.once('value', function(snapshot){
            var guardado;
            var tot = 0;
            if(snapshot.child('estado').exists()){
                var estado = snapshot.child('estado').val();
                if(estado == "guardado"){
                    guardado = true;
                    confirmando= false;
                    canToday = true;
                    document.getElementById("guardarBtn").style.backgroundColor = "#73ba40";
                    document.getElementById("guardarBtn").innerHTML = "Guardado";
                }else if(estado == "confirmando"||estado == "espera"){
                    ID_ENTREGA = parseInt(snapshot.child('ID_ENTREGA').val(), 10);

                    document.getElementById("moreProBtn").style.display= "none";
                    document.getElementById("guardarBtn").style.backgroundColor = "#73ba40";
                    document.getElementById("guardarBtn").innerHTML = "Confirmando...";
                    confirmar = false;
                    confirmando = true;
                    canToday= true;
                }else{
                    document.getElementById("guardarBtn").style.backgroundColor= "#df7233";

                    document.getElementById("moreProBtn").style.display= "block";
                    if(diaActual==diaRequested){
                        if(horaActual<13){
                            confirmar = true;
                            canToday = true;
                            document.getElementById("guardarBtn").innerHTML = "Confirmar";
                        }else if(horaActual>13){
                            confirmar = false;
                            canToday = false;
                            document.getElementById("guardarBtn").innerHTML = "Guardar";


                        }

                        confirmando = false;


                    }else{
                        document.getElementById("guardarBtn").innerHTML = "Guardar";
                        confirmar = false;
                        confirmando= false;
                    }


                }
            }
            if(snapshot.child('Hora de entrega').exists()){
                if(fromMob){

                    document.getElementById('horaEntrega').style.marginTop = "0.4vw";
                }else{
                    document.getElementById('horaEntrega').style.marginTop = "0.6vw";
                }
                var hora = parseInt(snapshot.child('Hora de entrega').val(),10);
                if(hora>12){
                    hora = hora-12;
                    document.getElementById('horaEntrega').innerHTML = "Hora de entrega<br>"+hora+" pm";
                }else{
                    document.getElementById('horaEntrega').innerHTML = "Hora de entrega<br>"+hora+" am";
                }

            }else{
                document.getElementById('horaEntrega').innerHTML = "Elige la Hora";

            }
            if(snapshot.child('Direccion de entrega').exists()){
                var dir= snapshot.child('Direccion de entrega').val();
                document.getElementById("dirTxt").innerHTML = dir;
            }else{
                document.getElementById("dirTxt").innerHTML = "";
            }
            if(snapshot.child('Total').exists()){

            }
            if(snapshot.child('Productos').exists()){
                carList = new Array();
                var totalOrden = 0;
                snapshot.child('Productos').forEach(function(prod){
                    var nombre = prod.key;
                    var can = parseInt(prod.child('cantidad').val(), 10);
                    var tipo = parseInt(prod.child('tipo').val(), 10);
                    var descripcion = prod.child('descripcion').val();
                    var total = parseInt(prod.child('total').val(), 10);
                    totalOrden = total + totalOrden;
                    tot += total;
                    var webUrl =  prod.child('weburl').val();
                    var url =  prod.child('url').val();
                    var uri =  prod.child('uri').val();
                    var caritem = new carItem(nombre, descripcion, tipo, can, total,webUrl, url, uri );
                    carList.push(caritem);

                });

                var prodContent = "";
                for(var i = 0; i<carList.length; i++){
                    prodContent += getCarView(carList[i], i);
                }
                document.getElementById("carContain").innerHTML = prodContent;


                var dom;

                if(snapshot.child('Cupon').exists()){
                    var index = parseInt(snapshot.child('Cupon/index').val(),10);
                    var valor = parseInt(snapshot.child('Cupon/valor').val(),10);
                    var totalDescontado = aplicarDescuento(valor, totalOrden);
                    snapshot.ref.child('totalDescontado').set(totalDescontado);
                    snapshot.ref.child('Total').set(totalOrden);
                    dom = getDomicilio(totalDescontado);
                    totalOrden += dom;
                    totalDescontado = totalDescontado+dom;
                    totalDescontado = redondearCifra(totalDescontado);
                    totalOrden = redondearCifra(totalOrden);
                    document.getElementById("totalTxt").style.textDecoration = "line-through";
                    document.getElementById("totalDescTxt").innerHTML = "$"+ totalDescontado;
                    document.getElementById("totalDesc").style.display ="flex" ;


                }else{
                    snapshot.ref.child('Total').set(totalOrden);
                    dom = getDomicilio(totalOrden);
                    totalOrden += dom;
                    totalOrden = redondearCifra(totalOrden);
                    document.getElementById("totalTxt").style.color = "#73ba40";
                    document.getElementById("totalTxt").style.textDecoration = "none";
                    document.getElementById("totalDesc").style.display = "none";

                }
                document.getElementById("totalTxt").innerHTML = "$"+totalOrden;
                document.getElementById("domTxt").innerHTML = "$"+redondearCifra(dom);

                snapshot.ref.child('domicilio').set(dom);
                if(guardado){
                    if(tot<1999){
                        var tos= new Toasty();
                        tos.show("Pide al menos $2000 pesos en productos", 2000);
                        goMain();
                    }else{
                         getOrden();
                    }

                }else if(confirmando){
                    showProgressDialog();
                }

            }else{

                document.getElementById("carContain").innerHTML = "";
                document.getElementById("totalTxt").innerHTML = "$"+0;
                document.getElementById("domTxt").innerHTML = "$"+0;
                snapshot.ref.child('Total').set(0);
                snapshot.ref.child('domicilio').set(0);
            }
        });
}

     function ordenDia(dia, orden){
        this.dia= dia;
        this.orden = orden;
     }

function orden(hora, direccion, total, domicilio, totaldescontado, estado, status,productos){
        this.hora = hora;
        this.direccion= direccion;
        this.total = total;
        this.domicilio = domicilio;
        this.totaldescontado = totaldescontado;
        this.estado = estado;
        this.status = status;
        this.productos = productos;
}


function redondearCifra(cifra){
        var nuevaCifra = 0;
        var cif = cifra.toString();
        var array = cif.split("");
        var i = array.length-1;
        var x = i-1;
        var y = i-2;
        var compString = array[x].toString();
        compString +=  array[i].toString();
        var compInt = parseInt(compString);
        if(compInt>50){
            var cente = array[y].toString();
            var centena = parseInt(cente);
            centena ++;
            if(centena>9){
                array[i] = '0';
                array[x] = '0';
                array[y] = '0';
                if(array.length>3){
                    var mil = array[y-1].toString();
                var milenia = parseInt(mil, 10);
                milenia++;
                if(milenia>9){
                    array[y-1] = '0';
                    if(array.length>4){
                        var dieZmilenia = parseInt(diezMil);
                        dieZmilenia ++;
                        if(dieZmilenia>9){
                            array[y-2] = '0';
                            if(array.length>5){
                                var cienMil = array[y-3].toString();
                                var cienMilenia = parseInt(cienMil);
                            }else{
                                var cienMil = "100000";
                                array = cienMil.split("");
                            }

                        }else{

                            diezMil = dieZmilenia.toString();
                            array[y-2] = diezMil.charAt(0);

                        }
                    }else{
                        var diezMil = "10000";
                        array = diezMil.split("");
                    }

                }else{
                    mil = milenia.toString();
                    array[y-1] = mil.charAt(0);
                }
            }else{
                    var mil = "1000";
                    array = mil.split("");
            }


            }else{
                array[i] = '0';
                array[x] = '0';

                cente = centena.toString();
                array[y] = cente.charAt(0);
            }


        }else{
            array[i] = '0';
            array[x] = '0';
        }

        var nuevaString = "";
        for(var i=0; i<array.length;i++){
            nuevaString += array[i].toString();
        }
        nuevaCifra = parseInt(nuevaString, 10);

        return nuevaCifra;
}
function getDomicilio(total){
        var domi = 0;
        if(total<3000){
            if(total<500){
                domi = 100;
            }else{
                domi = (total*20)/100;
            }

        }else if(total>=3000){
            domi = (total*18)/100;
            if(total>6000){
                domi = (total*16)/100;
                if(total>9000){
                    domi = (total*14)/100;
                    if(total>12000){
                        domi = (total*12)/100;
                        if(total>15000){
                            domi = (total*10)/100;
                            if(total>30000){
                                domi = 0;
                            }
                        }
                    }
                }
            }
        }
        return parseInt(domi,10);
}
function confirmarEntrega(){

        var refUs = database.ref('Usuarios/'+id+'/Suscripcion/Dia/'+dias[diaRequested-1].dia);
        var refMarch = database.ref('Marchantes/Main/Ordenes/Pendientes/enCurso/'+ID_ENTREGA);
        refUs.child('estado').set("si");
        refUs.child('Cupon').remove();
        refUs.child('status').set(0);
        refMarch.child('status').set(3);
        document.getElementById("alert").style.display = "none";
        var tos = new Toasty();
        tos.show("Gracias por preferirnos, recuerda compartir con tus amigos", 3000);
        reserva(dias[diaRequested-1].dia);
}
function aplicarDescuento(valor, total){
        var newVal = ((100-valor)*total)/100;

        return parseInt(newVal, 10);
}




function askForMarchante(){
        var cont = '<div class="marchantesDiv" ><button class="closeLeft" onclick="cerrarAlert(0, true)" style="background-image: url('+"src/icons/btn_back_arrow_grey.png"+')"></button><h1>¿Quien te recomendo?</h1><p>Elige tu vendedor</p><ul id="marchantes"></ul><div class="keep" onclick="setMarchante('+"'Main'"+')"><h2>Nadie me recomendo</h2><img src="src/icons/btn_right_arrow.png"></div></div>';
        document.getElementById("alert").innerHTML=cont;
        document.getElementById("alert").style.display= "block";
        var ref = database.ref('Marchantes/vendedores');
        ref.once('value', function(snapshot){
            if(snapshot.exists()){

                var vendCont = "";
                snapshot.forEach(function(vendedor){
                    vendCont += '<li onclick="setMarchante('+"'"+vendedor.key+"'"+')">'+vendedor.key+'</li>';
                });
                document.getElementById("marchantes").innerHTML= vendCont;
            }
        });
}
function setMarchante(march){
        var ref = database.ref('Usuarios/'+id);
        ref.child('Marchante').set(march);
        marchante = march;
        document.getElementById("alert").style.display = "none";
        askForCupones(cuponActivo);
}

window.onload = function(){

  s();
};

function resetCupon(index){
        var ref  = database.ref('Usuarios/'+id+'/Cupones');
        ref.push({value: index, state: true});
        clearCupones(false);


}
function askForCupones(pos){
        var ref = database.ref('Usuarios/'+id+'/Suscripcion/Dia/'+dias[diaRequested-1].dia);
        ref.once('value',function(snapshot){
            if(!snapshot.child('Cupon').exists()){
                if(pos==cuponActivo){
                    if(cupones!=null){
                        if(cuponActivo!=null){
                            document.getElementById("cupones").style.display = "none";
                            document.getElementById("ticket").style.display = "block";
                            document.getElementById("ticket").style.left = "0vw";
                            var dialog = viewDialog("¿Deseas usar este cupón", "Recibe el "+cupones[pos].valor+"% de descuento en el total de tu compra.", "src/icons/cupon_menu_icon_acent.png");
                            document.getElementById("alert").innerHTML = dialog;
                            document.getElementById("alert").style.display = "block";
                            document.getElementById("yesBtn").innerHTML = "Usar Cupón";
                            document.getElementById("yesBtn").addEventListener("click", function(){
                                    document.getElementById("alert").style.display = "none";
                                    canjearCupon(pos, cuponActivo);


                            });
                            document.getElementById("noBtn").innerHTML= "No";
                            document.getElementById("noBtn").addEventListener("click", function(){

                            document.getElementById("alert").style.display = "none";


                            });
                        }else{
                            orden_dia.comprobarHora();
                        }
                }else{
                        orden_dia.comprobarHora();
                }
                    }else{
                    var tos = new Toasty();
                    tos.show("Canjea el cupón disponible", 2000);
                }
            }else{
                if(guardando||confirmar){
                    orden_dia.comprobarHora();
                }else{
                    var tos = new Toasty();
                    tos.show("Ya usaste un cupón para esta compra", 3000);
                }

            }
        });
}
function canjearCupon(pos, active){
        if(pos==active){
            var ref = database.ref('Usuarios/'+id+'/Suscripcion/Dia/'+dias[diaRequested-1].dia);
            ref.child('Cupon/valor').set(cupones[active].valor);
            ref.child('Cupon/index').set(cupones[active].pos);
            var refcupon = database.ref('Usuarios/'+id+'/Cupones/'+active);
            refcupon.child('state').set(false);
            if(guardando||confirmando){
                orden_dia.comprobarHora();
            }
            reserva(dias[diaRequested-1].dia);

        }else{
            var tos = new Toasty();
            tos.show("Canjea el cupón disponible", 2000);
        }
}
function showCupones(){
        var pos = -25;
        var ticketpos = -1;
        document.getElementById("cupones").style.display = "block";
        var anim = setInterval(show, 8);
        function show(){
            if(pos >=0){
                clearInterval(anim);
                document.getElementById("cupones").style.display = "block";
                document.getElementById("ticket").style.display = "none";
            }else{
                pos = pos+1;
                ticketpos = ticketpos-0.64;
                document.getElementById("cupones").style.left = pos +"vw";
                document.getElementById("ticket").style.left = ticketpos +"vw";
            }
        }
}
function hideCupones(){
        var pos = 0;
        var ticketpos = -17 ;
        document.getElementById("ticket").style.display = "block";
        var anim = setInterval(hide, 8);
        function hide(){
            if(pos <=-25){
                clearInterval(anim);
                document.getElementById("cupones").style.display = "none";
                document.getElementById("ticket").style.left= "-1vw";
            }else{
                pos = pos-1;
                ticketpos = ticketpos+0.64;
                document.getElementById("cupones").style.left = pos +"vw";
                document.getElementById("ticket").style.left = ticketpos + "vw";
            }
        }
}
function getCupones(show){
        var ref = database.ref('Usuarios/'+id+'/Cupones');
        ref.once('value', function(snapshot){
            if(snapshot.exists()){
                cupones= new Array();
                snapshot.forEach(function(cupo){
                    var valor = cupo.child('value').val();
                    var state = cupo.child('state').val().toString();
                    var stat;
                    if(state == "true"){
                        stat= true;
                    }else{
                        stat= false;
                    }

                    var cup = new Cupon(valor, stat, parseInt(cupo.key, 10));
                    cupones.push(cup);
                });
                var cont = "";

                for(var i= 0; i<cupones.length;i++){
                    if(cupones[i].state){
                        cuponActivo = cupones[i].pos;
                        break;
                    }
                }

                for(var i= 0; i< cupones.length;i++){
                    cont += getCuponView(cupones[i], cuponActivo);

                }

                document.getElementById("cuponesList").innerHTML = cont;
                if(show){
                    showCupones();
                }else{

                        var anim = setInterval(frame, 6);
                        var pos = -14;
                        document.getElementById("ticket").style.display = "block";
                        function frame(){
                            if(pos>=0){
                                clearInterval(anim);
                                reserva(dias[diaRequested-1].dia);
                            }else{
                                pos = pos+1;
                                document.getElementById("ticket").style.left = pos+"vw";
                            }
                        }





                }

            }else{
               orden_dia = new Orden(dias[diaRequested-1].dia);
               orden_dia.reserva();
               console.log('new orden_dia');

                //reserva(dias[diaRequested-1].dia);
            }

        });
}





function showAuthDialog(){
        var content =   '<div class="login"><button class="closeLeft" onclick="cerrarAlert(0, true)"></button><h2>Para continuar accede con tu cuenta de Google</h2>';
            content +=  '<div ><button id="iniciarSesion" onclick="autenticarGoogle()"></button></div>';
            content +=  '<div class="checkDiv"><h7 class="checkTxt">';
            content +=  'Al continuar confirmas que has leido y aceptas las';
            content +=  '</h7><h5 class="terms" onclick="verTerminos()"> ';
            content +=  'Politicas de Privacidad y Terminos de tratamiento de datos.';
            content +=  '</h5></div></div>';
        document.getElementById("alert").innerHTML = content;
        document.getElementById("alert").style.display= "block";
}
function showProgressDialog(){
        var ref  = database.ref('Usuarios/'+id+'/Suscripcion/Dia/'+dias[diaRequested-1].dia);
        ref.once('value', function(snapshot){
            ID_ENTREGA = parseInt(snapshot.child('ID_ENTREGA').val(),10);
            document.getElementById("alert").style.display = "block";
            document.getElementById("alert").innerHTML = getProgressDialog();
            document.getElementById("btnOkConfirmando").style.display = "none";
                document.getElementById("confirTxt").style.display = "none";
            if(snapshot.child('estado').val()=="confirmando"){
                document.getElementById("tituloConfirmando").innerHTML = "Confirmando";
            }else if(snapshot.child('estado').val()=="espera"){
                if(parseInt(snapshot.child('status').val())==1){
                    document.getElementById("tituloConfirmando").innerHTML = "Empacando";
                }else if(parseInt(snapshot.child('status').val())==2){
                    document.getElementById("tituloConfirmando").innerHTML = "En Camino";
                    document.getElementById("btnOkConfirmando").style.display = "block";
                    document.getElementById("confirTxt").style.display = "block";
                }


            }

            var total;
            if(snapshot.child('totalDescontado').exists()){
                total = parseInt(snapshot.child('totalDescontado').val(),10);
            }else{
                total = parseInt(snapshot.child('Total').val(),10);
            }
            var dom = getDomicilio(total);
            total = total + dom;
            total = redondearCifra(total);
            document.getElementById("totalConfirmando").innerHTML = "$"+total;
            document.getElementById("direccionConfirmando").innerHTML = snapshot.child('Direccion de entrega').val();




        });
}
function getProgressDialog(){
        var contenido = '<div class="confirmar"><div  class="menuContainer"><button class="btnbackconf" onclick="hideConfirmando()"></button><h1 id="tituloConfirmando"></h1></div><h1 >Te lo llevamos a... </h1><div class="dirContConf"><h1 id="direccionConfirmando"style=" "></h1></div><h1 >Total + Domicilio</h1><div class="dirContConf"><h1 id="totalConfirmando"></h1></div><button class="detailBtn" onclick="hideConfirmando()">Ver Detalles</button>    <button id="btnOkConfirmando" onclick="confirmarEntrega(';
        contenido += ')"></button>  <h1 id="confirTxt">Confirma si ya recibiste tu pedido</h1></div>';
        return contenido;
}




function Cupon(valor, state, pos){
        this.valor = valor;
        this.state = state;
        this.pos = pos;
}

function dia(day, dia){
        this.day = day;
        this.dia = dia;
}
function notificacion(key, titulo, cuerpo, state, accion){
        this.key = key;
        this.titulo = titulo ;
        this.cuerpo = cuerpo  ;
        this.state = state ;
        this.accion = accion ;
}

function viewDialog(titulo, contenido, img){
        var contentDialog = '<div id="dialog" ><div class="dialogHead"><img ';
        if(img=="src/icons/zero_img.png"){
            contentDialog += 'style="display: none;"';
        }
        contentDialog += 'src="';
        contentDialog += img ;
        contentDialog += '"><h1 ';
        if(img=="src/icons/zero_img.png"){
            if(fromMob){
                contentDialog += 'style="width: 80vw;"';
            }else{
                contentDialog += 'style="width: 50vw;"';
            }

        }
        contentDialog +='>';
        contentDialog += titulo;
        contentDialog += '</h1></div><p >';
        contentDialog += contenido;
        contentDialog += '</p><div class="dialogBtnCont"><button id="noBtn" class="noBtn">';
        contentDialog += '</button><button id="yesBtn" class="yesBtn">';
        contentDialog += '</button></div></div>';
        return contentDialog
}

function getPromosView(promos){
        var cont = '<button class="closeAlert" onclick="cerrarAlert(0, true)"></button><div class="promosDiv"><ul><li';

         cont += '><button>Ver más</button></li><li';
         cont += '><button>Ver más</button></li><li';
         cont += '><button>Ver más</button></li></ul></div>';
         return cont;
}
function getCuponView(cupon, active){
        var cont = '<li class="cupon" style="background-image: url(';
        if(cupon.state){
            if(cupon.pos>cuponActivo){
                if(cupon.valor==33){
                     cont += 'src/icons/cupon_box_gold.png';
                }else{
                     cont += 'src/icons/cupon_box_clear.png';
                }

            }else{
                if(cupon.valor==33){
                     cont += 'src/icons/cupon_box_gold.png';
                }else{
                     cont += 'src/icons/cupon_box.png';
                }

            }

        }else if(!cupon.state){

            cont += 'src/icons/cupon_box_used.png';
        }


        cont +=');" onclick="askForCupones(';
        cont += cupon.pos;
        cont +=')"><h1>';
        cont += cupon.valor+"%";
        cont += '</h1></li>';
        return cont;
}






function irFacebook(){window.open("https://www.facebook.com/medialuna.deli");}
function irInstagram(){window.open("https://www.instagram.com/medialuna.delicatessen");}
function shareUrl(){
        var textarea = document.createElement('textarea');
        textarea.value = "https://goo.gl/V7Vfxk";
        textarea.setAttribute('id','urlText');
        document.body.appendChild(textarea);
        document.getElementById("urlText").select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        shareInt('https://today-6648d.firebaseapp.com', 'Hola, quiero compartiresta fantástica Panaderia contigo');
}
function shareInt(url,  body){
       if (navigator.share) {
        navigator.share({
            text: body,
            url: url,
        }).then(() =>console.log(''))
        .catch((error) => console.log('Error sharing', error));
        }else{
            var textarea = document.createElement('textarea');
            textarea.value = url;
            textarea.setAttribute('id','urlText');
            document.body.appendChild(textarea);
            document.getElementById("urlText").select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            var tos = new Toasty();
            tos.show("El enlace se copió en el portapapeles, compartelo con tus amigos para ganar descuentos y promociones!!", 5000);

        }
}




function getFecha(){
        var d = new Date();
        var dia = d.getDay();
        var mes = d.getMonth();
        var ano = d.getFullYear();

        var line = dia +"/"+mes+"/"+ano;
        return line;
}
function verTerminos(){
        window.open("https://docs.google.com/document" +
                "/d/1ZGblZTS1Pdtmae-ybBdSklASFN8zWXkr01XlQCBvUSg/mobilebasic");
}
function checkTerms(){
        authChecked = true;
        document.getElementById("iniciarSesion").style.backgroundImage = "url('src/signin-assets/btn_google_signin_light_normal_web.png')";
}
function verPromociones(){

        document.getElementById("mainMenu").style.display = "none";
        document.getElementById("alert").style.display="none";

        var ref = database.ref('PromoPic');
        ref.once('value', function(snapshot){
            if(!snapshot.exists()){
                var url;
                var promos = new Array();
                var promoDiv = getPromosView(promos);
                document.getElementById("alert").innerHTML= promoDiv;
                document.getElementById("alert").style.display = "block";
            }

        });
}
function hideConfirmando(){document.getElementById("alert").style.display = "none";}

function testiarChino(){

        var groserias = new Array();
        groserias.push("1");
        groserias.push("2");
        groserias.push("3");
        groserias.push("4");
        groserias.push("5");
        groserias.push("6");
        for(var i=0;i<groserias.length;i++){
            var tos = new Toasty();
            tos.show(groserias[i], 800);

        }
}
function s(){
    requirejs([Productos], function(Proresult){
      Productos = Proresult;
      requirejs([Orden], function(Ordresult){
        Orden = Ordresult;
        requirejs([Publicaciones], function(Pubresult){
            Publicaciones = Pubresult;
            requirejs([AR], function(ARResult){
                AR = ARResult;
                requirejs([Engine], function(engineR){
                    Engine = engineR;
                    requirejs([ColorPicker], function(picker){
                      ColorPicker = picker;
                      hi();
                    })


                });

            });

        });

      });
    });


}
class Toasty{



        constructor(){

        }

        show(contenido, time){
            if(!toasting){
                toasting = true;
                var init = setTimeout(mostrar, 150);
                function mostrar(){
                    var toasCont = document.getElementById("toast");
                    toasCont.innerHTML = contenido;
                    var opacity = 0;
                    var anim = setInterval(frame, 12);
                    function frame(){
                        toasCont.style.display = "block";
                        if(opacity >= 1){
                            clearInterval(anim);
                            var countdown = setTimeout(hide, time);

                            function hide(){
                                clearTimeout(countdown);
                                var opacity = 1;
                                var anim2 = setInterval(frame, 12);
                                function frame(){
                                    if(opacity<=0){
                                        toasting = false;
                                        clearInterval(anim2);
                                        toasCont.style.display= "none";
                                        if(toastBackStack!=null){
                                            for(var i=0;i<toastBackStack.length;i++){
                                                if(toastBackStack[i].contenido==contenido){
                                                    toastBackStack.splice(i, 1);
                                                    break;
                                                }
                                            }
                                            if(toastBackStack.length>0){
                                                var pos = 0;
                                                var tos = new Toasty();
                                                tos.show(toastBackStack[pos].contenido, toastBackStack[pos].tiempo);
                                            }
                                        }
                                    }else{
                                        opacity = opacity - 0.16;
                                        toasCont.style.opacity = opacity;
                                    }
                                }
                            }

                        }else{
                            opacity = opacity+0.16;
                            toasCont.style.opacity = opacity ;
                        }
                    }
                }
            }else{
                if(toastBackStack!=null){
                    var tos= new toas(contenido,time);
                    toastBackStack.push(tos);
                }else{
                    toastBackStack = new Array();
                    var tos= new toas(contenido,time);
                    toastBackStack.push(tos);
                }
            }



        }
}
function toas(contenido, tiempo){
        this.contenido= contenido;
        this.tiempo=tiempo;
}
function toast(content, timeOutVar){
        var init = setTimeout(show, 150);
        function show(){
            var toasCont = document.getElementById("toast");
        toasCont.innerHTML = content;

        var opacity = 0;
        var anim = setInterval(frame, 12);
            function frame(){
              toasCont.style.display = "block";
              if(opacity >= 1){
                clearInterval(anim);

                var countdown = setTimeout(hide, timeOutVar);
                    function hide(){
                        clearTimeout(countdown);
                        var opacity = 1;
                        var anim2 = setInterval(frame, 12);
                            function frame(){
                                if(opacity<=0){
                                        clearInterval(anim2);
                                        toasCont.style.display= "none";
                                }else{
                                        opacity = opacity - 0.16;

                                        toasCont.style.opacity = opacity;
                                }
                            }
                    }

              }else{
                opacity = opacity+0.16;

                toasCont.style.opacity = opacity ;
              }
            }

            return true;
        }
}
var promptEvent;
window.addEventListener('beforeinstallprompt', (event)=>{
     prompEvent = event;
     document.getElementById("install").style.display = "flex";
     event.preventDefault();
     return false;
});
function showPrompInstall(){
    if(prompEvent){
        prompEvent.prompt();
        prompEvent.userChoise.then(function(response){
            if(response.outcome =='dismissed'){
                document.getElementById('install').style.display = "flex";
            }
            else{
                document.getElementById('install').style.display = "none";
            }
        });
    }

}
function readUser(){
    var ref = database.ref('Usuarios/'+id);
    ref.once('value', function(snapshot){

    });
}
var engine;
function initEngine(){
    engine = new Engine();
    engine.load3dObj();
    document.getElementById('drawing').style.display = 'grid';
    document.getElementById('alert').style.display = 'block';
}
var colorPicker;
function initColorPicker(){

    colorPicker = new ColorPicker();
    colorPicker.init();


}





/*function mostrarProductos(fromInit){

        var view = '';
        var count = 1;
        for(var i =0; i<productos.length;i++){
            if(!fromMob){
                if(count<4){
                    if(count==1){
                         view+= '<ul>';
                    }
                    view += getView(productos[i]);
                    if(i==productos.length){
                            view+= '</ul>';
                    }
                    count ++;
                }else if(count==4){
                      view += getView(productos[i]);
                      view+= '</ul>';
                      count = 1;
                }

            }else{
                view += getView(productos[i]);
            }
        }
        view += '</ul>';
        document.getElementById("productos").innerHTML = view;
        document.getElementById("cargandoProds").style.display="none";
        if(query&&!playingQuery){
            playQuery();

        }else{
            if(fromInit){
                checkForUser();
            }
        }

}*/










var comparando = false;


function verMuro(){
    if(user==null){


        document.getElementById("pubLoading").style.display = "block";
        var mainMenu = document.getElementById("hamButton");
        var menuBtn = document.getElementById("menuButton");
        var title = document.getElementById("mainTitle");
        var logo = document.getElementById("logoHead");
        var noti = document.getElementById("notification");
        var second = document.getElementById("secondary");
        document.getElementById("header").innerHTML = "";


        var newMenu = document.createElement('button');
        var newTitle = document.createElement('h1');

        newTitle.setAttribute('id', 'mainTitle');


        newMenu.setAttribute('id', 'menuButton');
        var newMain = document.createElement('button');
        newMain.setAttribute('id','hamButton');
        document.getElementById("header").appendChild(newMain);
        document.getElementById("header").appendChild(newTitle);
        document.getElementById("header").appendChild(newMenu);


        document.getElementById("mainTitle").innerHTML = "La Red del Pan" ;
        document.getElementById("mainTitle").style.textAlign = "center";




        document.getElementById("menuButton").addEventListener("click", verRecetas);
        document.getElementById("mask").style.display = "none";


        document.getElementById("canasta").style.display = "none";
        document.getElementById("hamButton").addEventListener("click", function(){
            document.getElementById("redelpan").style.display = "none";
            goMain();
        });
        if(fromMob){
            document.getElementById("menuButton").style.backgroundImage = "url('src/icons/recetas_icon.png')";
            document.getElementById("hamButton").style.backgroundImage = "url('src/icons/btn_back_arrow.png')";
            document.getElementById("mainTitle").style.width = "90vw";
            document.getElementById("menuButton").style.marginLeft = "4vw";
            document.getElementById("menuButton").style.borderRadius = "0vw";
        }else{
            document.getElementById("mainTitle").style.marginLeft = "8vw";
            document.getElementById("menuButton").style.backgroundImage = "url('src/icons/recetas_icon.png')";
            document.getElementById("hamButton").style.backgroundImage = "url('src/icons/btn_back_arrow_orange.png')";
        }
        document.getElementById("container").style.display = "none";
        document.getElementById("redelpan").style.display = "block";

        pubs.cargarPublicaciones();
    }else{
        showAuthDialog()
    }



}

function verRecetas(){

}
var aug;
function showAR(){
    aug = new AR();

}
