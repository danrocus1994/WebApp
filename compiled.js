var version =  'debug=0.0.1.3.5';

var focused = false;
var sw;
var fromDay=false;
var database;
var productos;
var productosJson;
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
var marchante ="";
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
window.onblur = function(){
    if(focused){
        focused = false;
    }
   
};


//Flow

//Init & setup Anon and Cookies


function hi(){
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
    
    
    navigator.serviceWorker.register('service-worker.js')
        .then(function(reg){ 
        sw = reg;
       
        setup();   
        
    }).catch(function(err) {
        
    });
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
        if(horaActual>=17||horaActual>=13){
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
                    document.getElementById("salute").style.display = "block";
                    document.getElementById("sessionPhone").innerHTML= user.email;

                    document.getElementById("subTitle").addEventListener("click", showMenuMain);
                    var str = id.split(" ");
                    if(fromMob){
                         document.getElementById("salute").innerHTML = "Hola "+str[0]+"\\nelige lo que quieres probar";
                    }else{
                         document.getElementById("salute").innerHTML = "Hola "+str[0]+" elige lo que quieres probar";
                    }
                    cargarData();
                }else{
                    id = getCooKie();
                    if(id==""||id==null){
                        grabarAnon();
                    }else{
                        var tos = toast("Hola de nuevo", 2000);
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

//User Settings, Registration of Service Workers


function autenticarGoogle(){

        if(!authChecked){
            document.getElementById("alert").style.display="none";
            var provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
        // var user = result.user;
            user = result.user;
            anon  = id;
            document.getElementById("salute").style.display = "block";
            var str = user.displayName.split(" ");
            document.getElementById("salute").innerHTML = "Hola "+str[0];
            

            
            checkForUser();
        // ...
            }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email= error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
           
            // ...
            });
        }else{
            var tos = toast("Debes aceptar haber leido nuestros terminos de tratamiento de datos", 3000);
        }
}
function checkForUser(){
    if(user!= null){
        var ref = database.ref('Usuarios/'+user.displayName);
        ref.once('value', function(snapshot){
            if(snapshot.exists()){
                window.onfocus = function(){
                    if(!focused){
                        focused = true;
                        checkNotis();
                    }
                    

                }; 
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
                ref.child('descuento/estado').set("no");
                ref.child('descuento/valor').set(0);
                ref.child('things/nick').set(user.displayName);
                ref.child('things/telefono').set("");
                if(marchante!=""){
                    ref.child('Marchante').set(marchante);
                }
                ref.child('things/PhotoUrl').set(user.photoURL);
                if(guardando||confirmar){
                   
                    getOrdenFromAnon();
                }else{
                    checkForUser();
                }
}
function getOrdenFromAnon(){
        
            var ref = database.ref('Usuarios/'+anon);
            ref.once('value', function(snapshot){
                
                if(snapshot.exists()){
                    
                    try{
                    var ordenesList = new Array();
                    snapshot.child('Suscripcion/Dia').forEach(function(dia){
                        
                        var hora = parseInt(dia.child('Hora de entrega').val(), 10);
                       
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

                    
                    
                   
                    
                    grabarOrden(ordenesList);
                   }catch(err){
                     
                   }
                        
                    
                    
                    
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
             document.getElementById("hamButton").style.backgroundImage = "url('src/icons/ham_icon_orange.png')";
             document.getElementById("subTitle").style.display ="none"; 
             document.getElementById("mainTitle").innerHTML= "Medialuna";
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
                    document.getElementById("menuButton").style.backgroundImage = "url('src/icons/usu_orange.png')";
             
                }else{
                    document.getElementById("menuButton").style.backgroundImage = "url('src/icons/usu_orange.png')";
          
                }
       
                document.getElementById("menuButton").addEventListener("click", showAuthDialog);
        }
        document.getElementById("loading").style.display = "none"; 
        cargarProductos('Para Desayunar');
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
//Messaging


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


//Navigation


function goMain(){
        windState = 0;
        document.getElementById("ticket").style.display = "none";
        document.getElementById("cupones").style.display = "none";
        document.getElementById("container").style.display = "block";
        document.getElementById("diaContainer").style.display = "none";
        
        var menuBtn = document.getElementById("menuButton");
        var mainMenu = document.getElementById("hamButton");
        var title = document.getElementById("mainTitle");
        document.getElementById("header").removeChild(title);
        document.getElementById("header").removeChild(menuBtn);
        document.getElementById("header").removeChild(mainMenu);
      


        var newMenu = document.createElement('button');
        var newMain = document.createElement('button');
        var newTitle = document.createElement('h1');
        var newLogo = document.createElement('img');
        newLogo.src = "src/icons/orden_logo.png";
        
        newLogo.setAttribute('id', 'logoHead');
        newMenu.setAttribute('id', 'menuButton');
        newTitle.setAttribute('id', 'mainTitle');
        newMain.setAttribute('id', 'hamButton');
        
        document.getElementById("header").appendChild(newMain);
        document.getElementById("header").appendChild(newLogo);
        document.getElementById("header").appendChild(newTitle);
        document.getElementById("header").appendChild(newMenu);
      
        document.getElementById("menuButton").style.backgroundSize = "cover";
        document.getElementById("hamButton").addEventListener("click", showMenuMain);
       
        
        if(fromMob){
             document.getElementById("mainTitle").style.textAlign = "center";
        
            document.getElementById("mainTitle").innerHTML= "Medialuna";
            document.getElementById("hamButton").style.backgroundImage = "url('src/icons/ham_icon_orange.png')"

            }else{
            document.getElementById("mainTitle").style.textAlign = "left";
            document.getElementById("mainTitle").style.marginLeft = "12vw";
            document.getElementById("mainTitle").innerHTML= "";
            document.getElementById("mainTitle").style.backgroundImage = "url('src/icons/title.png')";
            document.getElementById("mainTitle").style.padding = 0;
            document.getElementById("hamButton").style.backgroundImage = "url('src/icons/ham_icon_orange.png')"
           
        }
        if(user!=null){
            document.getElementById("subTitle").innerHTML = id;
             document.getElementById("menuButton").style.backgroundImage = "url('"+photoUrl+"')";
             document.getElementById("subTitle").addEventListener("click", showMenuMain);
             document.getElementById("menuButton").addEventListener("click", showMenuMain);
            }else{
            document.getElementById("subTitle").innerHTML = "Iniciar Sesión";
           
            
            if(fromMob){
                 document.getElementById("menuButton").style.backgroundImage = "url('src/icons/usu_orange.png')";
            }else{
                 document.getElementById("menuButton").style.backgroundImage = "url('src/icons/usu_orange.png')";
            }
           
            document.getElementById("menuButton").addEventListener("click", showAuthDialog);
        }
        
        requestDia(dias[diaRequested-1].day);
}
function showCanasta(){
        if(!isCanastaShowing){
            if(fromMob){
                var pos = 0;
                 var maskPos = -26;
                var anim = setInterval(frame, 10);
                document.getElementById('canasta').style.display = "block";
                document.getElementById('mask').style.display = "block";
                function frame(){
                    if(pos>=22){
                        clearInterval(anim);
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
                document.getElementById('canasta').style.display = "block";
                document.getElementById('mask').style.display = "block";
                function frame(){
                    if(pos>=4){
                        clearInterval(anim);
                    }else{
                        pos= pos +1;
                        maskPos= maskPos+ 1;
                        document.getElementById('canasta').style.bottom = pos+"vw";
                        document.getElementById('mask').style.bottom = maskPos+"vw";
                    }
                }
            }
            
        }
        
        return true;
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
        document.getElementById("container").style.display = "none";
        document.getElementById("diaContainer").style.display = "block";
        document.getElementById("subTitle").innerHTML = "";
        
        isCanastaShowing = false;

        var mainMenu = document.getElementById("hamButton");
        var menuBtn = document.getElementById("menuButton");
        var title = document.getElementById("mainTitle");
        var logo = document.getElementById("logoHead");
        var noti = document.getElementById("notification")
        noti.style.display = "none";
        document.getElementById("header").removeChild(menuBtn);
        document.getElementById("header").removeChild(mainMenu);
        document.getElementById("header").removeChild(title);
       
        if(logo!=null){
            document.getElementById("header").removeChild(logo);
        }
        
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
        document.getElementById("menuButton").addEventListener("click", removeDia);
        document.getElementById("mask").style.display = "none";
        document.getElementById("canasta").style.display = "none";
        document.getElementById("hamButton").addEventListener("click", verProductos);
        if(fromMob){
            document.getElementById("menuButton").style.backgroundImage = "url('src/icons/cancel_btn_orange.png')";
            document.getElementById("hamButton").style.backgroundImage = "url('src/icons/btn_back_arrow_orange.png')"
        }else{
            document.getElementById("mainTitle").style.marginLeft = "8vw";
            document.getElementById("menuButton").style.backgroundImage = "url('src/icons/cancel_btn_orange.png')";
            document.getElementById("hamButton").style.backgroundImage = "url('src/icons/btn_back_arrow_orange.png')"
        }

        getCupones(false);
}
function verProductos(){
        if(carList!=null&&carList.length>0){
            fromDay =true;
            goMain();
        }else{
            fromDay =false;
            goMain();
        }
}
function verPerfil(){
       document.getElementById("sessionUser").innerHTML = id;
       document.getElementById("sessionPhoto").src = user.photoURL;
}
function showMenuMain(){
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
            productos[pos].tipo = 0;
            document.getElementById("alert").style.display= "none";
        }else{
            document.getElementById("alert").style.display= "none";
        }

        if(editandoItem){
            editandoItem = false;
            reserva(dias[diaRequested-1].dia);
        }
}


//shopping Functions



function mostrarProductos(fromInit){
        document.getElementById("cargandoProds").style.display="flex";
        var view = '';
        var count = 1;
        for(var i =0; i<productos.length;i++){
            if(!fromMob){
                if(count<3){
                    if(count==1){
                         view+= '<ul>';
                    }
                    view += getView(productos[i]);
                    if(i==productos.length){
                            view+= '</ul>';
                    }
                    count ++;
                }else if(count==3){
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
        if(fromInit){
            checkForUser();
        }else{
            document.getElementById("cargandoProds").style.display="none";
            if(query){
                playQuery();

            }
        }
}
function playQuery(){
    switch(query.action){
        case '0':
            if(query!=null){
                abrirDiaDesdeNotificacion()
            }
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
                    isCanastaShowing = anim;
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
                mostrarProductos(false);
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
        if(dia==day&&!canToday){
            var tos = new Toasty();
            tos.show("Nuestro horario de atención para hoy<br>de 7am a 1pm, recuerda reservar tus pedidos del resto de la semana", 5000);
            cargarProductos(categoria);
        }else{

            diaRequested = dia;
            document.getElementById("dia").innerHTML =  dias[diaRequested-1].dia;
          
            document.getElementById("diasList").style.display = "none";
            var tos = new Toasty();
            tos.show(dias[diaRequested-1].dia, 2000);
            cargarProductos(categoria);
        }
}
function compareConProductos(){
        if(isCanastaShowing){
            for(var i=0; i<productos.length;i++){
                    for(var j=0 ; j<carList.length;j++){
                        if(carList[j].nombre == productos[i].nombre){
                            productos[i].isTaken = true;
                           
                        }
                    }
            }
            mostrarProductos(false);


        }else{
            for(var i=0; i<productos.length;i++){
                    
                        productos[i].isTaken = false;
                        
                    
            }
            mostrarProductos(false);
        }
}
function mostrarFoto(foto){
        var cont = '<img class="fotoViewer" onclick="cerrarAlert(0, true)" src="'+productos[foto].url+'">';
        document.getElementById("alert").innerHTML = cont;
        document.getElementById("alert").style.display = "block";
}
function showB(pos){
        if(!showingProd&&actualProd==null){
           
            actualProd = pos;
            showingProd = true;
            document.getElementById("prod"+pos.toString()).style.display = "block";         
           
        }else if(!showingProd&&actualProd!=pos||showingProd&&actualProd!=pos){
          
            if(pos>productos.length-1){
                document.getElementById("prod"+actualProd.toString()).style.display = "none";
            }
            cancelCloseB=false;
            actualProd = pos;
            showingProd = true;
            document.getElementById("prod"+pos.toString()).style.display = "block";            

        }else if(!showingProd&&actualProd==pos||showingProd&&actualProd==pos){
          
            if(!cancelCloseB){
                cancelCloseB=true;
            }
            showingProd = true;
            document.getElementById("prod"+pos.toString()).style.display = "block";
            
        }
}
function hideB(pos){
     if(showingProd){
            cancelCloseB = false;
            var time = setTimeout(hide, 400);
            function hide(){
                if(!cancelCloseB){
                    showingProd = false;
                   
                    document.getElementById("prod"+pos.toString()).style.display ="none";
                    
                }
            }
            
        }
}
function restar(pos){
        if(!confirmando){
            var actual = productos[pos].actual;
        if(actual>1){
            actual = actual-1;
            productos[pos].actual= actual;
            if(editandoItem){
                if(productos[pos].tipo==1){
                    var priceActual = actual * productos[pos].precioPaq;
                    productos[pos].precioActual = priceActual ; 
                   
                    document.getElementById("textCantPaq"+pos).innerHTML = "Cant: "+actual+" paq";
                    document.getElementById("txtPrecioPaq"+pos).innerHTML ="$"+ priceActual;
                }else{
                    var priceActual = actual * productos[pos].precioUnidad;
                    productos[pos].precioActual = priceActual ; 
                   
                    document.getElementById("textCantPaq"+pos).innerHTML = actual+" unds";
                    document.getElementById("txtPrecioPaq"+pos).innerHTML ="$"+ priceActual;
                }
            }else{
                if(productos[pos].tipo==1){
                    var priceActual = actual * productos[pos].precioPaq;
                    productos[pos].precioActual = priceActual ; 
                   
                    document.getElementById("textCantPaq"+pos).innerHTML = "Cant: "+actual+" paq";
                    document.getElementById("txtPrecioPaq"+pos).innerHTML ="$"+ priceActual;
                }else{
                    var priceActual = actual * productos[pos].precioUnidad;
                    productos[pos].precioActual = priceActual ; 
                   
                    document.getElementById("und"+pos).innerHTML = actual+" unds";
                    document.getElementById("price"+pos).innerHTML ="$"+ priceActual;
                }
            }
            
            
        }
        }
}
function sumar(pos){
        if(!confirmando){
            var actual = productos[pos].actual;
            actual = actual+1;
            productos[pos].actual= actual;
            if(editandoItem){
                if(productos[pos].tipo==1){
                    var priceActual = actual * productos[pos].precioPaq;
                    productos[pos].precioActual = priceActual; 
                   
                    document.getElementById("textCantPaq"+pos).innerHTML ="Cant: "+ actual+" paq";
                    document.getElementById("txtPrecioPaq"+pos).innerHTML ="$"+ priceActual;
                }else{
                    var priceActual = actual * productos[pos].precioUnidad;
                    productos[pos].precioActual = priceActual; 
                   
                    document.getElementById("textCantPaq"+pos).innerHTML = "Cant: "+ actual+" unds";
                    document.getElementById("txtPrecioPaq"+pos).innerHTML ="$"+ priceActual;
                }
            }else{
                if(productos[pos].tipo==1){
                    var priceActual = actual * productos[pos].precioPaq;
                    productos[pos].precioActual = priceActual; 
                    
                    document.getElementById("textCantPaq"+pos).innerHTML ="Cant: "+ actual+" paq";
                    document.getElementById("txtPrecioPaq"+pos).innerHTML ="$"+ priceActual;
                }else{
                    var priceActual = actual * productos[pos].precioUnidad;
                    productos[pos].precioActual = priceActual; 
                    
                    document.getElementById("und"+pos).innerHTML = actual+" unds";
                    document.getElementById("price"+pos).innerHTML ="$"+ priceActual;
                }
            }
        }
}
function agregar(pos){
        if(!confirmando){
            var contenido =  productos[pos].nombre;
        var namePro= productos[pos].nombre;
        contenido += productos[pos].precioActual;
        contenido += productos[pos].actual;
        var andUrl = '/data/data/com.medialuna.delicatessen.cali/files/'+ productos[pos].andUrl+'.png';
        var ref = firebase.database().ref('Usuarios/'+id);
         ref.once('value', function(snapshot){
            var total = 0;
            var dom = 0;
                if(snapshot.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/Productos').exists()){
                    if(editandoItem){
                        var desc = "";
                        if(productos[pos].tipo==0){
                            desc = productos[pos].descPro;
                        }else{
                            desc = productos[pos].descPaq;
                        }
                        snapshot.ref.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/Productos/'+productos[pos].nombre).set({
                                cantidad: productos[pos].actual,
                                descripcion: desc,
                                tipo :  productos[pos].tipo,
                                total: productos[pos].precioActual,
                                weburl: productos[pos].url,
                                url: andUrl,
                                uri: 1
                        });
                        document.getElementById("alert").style.display= "none";
                        reserva(dias[diaRequested-1].dia);

                    }else{
                        var newCant;
                    var totPro;
                    var newDesc;
                    var total = parseInt(snapshot.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/Total').val(), 10);
                    if(snapshot.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+"/Productos/"+namePro).exists()){
                        var type =  parseInt(snapshot.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+"/Productos/"+namePro+"/tipo").val(),10);
                        var tot = parseInt(snapshot.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+"/Productos/"+namePro+"/total").val(), 10);
                        var cant =  parseInt(snapshot.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+"/Productos/"+namePro+"/cantidad").val(),10);
                        newDesc = snapshot.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+"/Productos/"+namePro+"/descripcion").val();
                        
                        if(type!=productos[pos].tipo){
                            newCant = productos[pos].actual;
                            totPro = productos[pos].precioActual;
                            total = total-tot;
                            total = total + totPro;
                            dom = getDomicilio(total);
                            if(productos[pos].tipo==1){
                                newDesc = productos[pos].descPaq;
                            }
                            

                        }else{
                            newCant = cant+ productos[pos].actual;
                            totPro = tot + productos[pos].precioActual;
                            total = total+ productos[pos].precioActual;
                            dom = getDomicilio(totPro);
                            
                        }

                        

                        snapshot.ref.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/Total').set(total);
                        snapshot.ref.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/domicilio').set(dom);
                        


                        
                    }else{
                        var tot = snapshot.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/Total').val();
                        total = parseInt(tot, 10);
                        newCant= productos[pos].actual;
                        if(productos[pos].tipo==1){
                            newDesc = productos[pos].descPaq;
                        }else{
                            newDesc = productos[pos].descPro;
            
                        }
                        
                        totPro = productos[pos].precioActual;
                        total = total + productos[pos].precioActual;
                        dom = getDomicilio(total);
                        snapshot.ref.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/Total').set(total);
                        snapshot.ref.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/domicilio').set(dom);

                    
                    }
                    snapshot.ref.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/Productos/'+productos[pos].nombre).set({
                                cantidad: newCant,
                                descripcion: newDesc,
                                tipo :  productos[pos].tipo,
                                total: totPro,
                                weburl: productos[pos].url,
                                url: andUrl,
                                uri: 1
                        });
                    
                    if(editandoItem){
                        cerrarAlert(pos, true);
                    }else{
                        if(productos[pos].tipo==1){
                            cerrarAlert(pos, true);
                        }
                        var tos = new Toasty();
                        tos.show(productos[pos].nombre+" agregado al "+dias[diaRequested-1].dia, 2000);

                    }
                    
                var content = 'Total + Domicilio  $';
                var intTotal = total+dom;
                content += redondearCifra(intTotal);
                checkDay();
                    }
                    

                }else{
                    total = productos[pos].precioActual;
                    dom = getDomicilio(total);
                    snapshot.ref.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/estado').set('si');
                    snapshot.ref.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/status').set(0);
                    snapshot.ref.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/Total').set(productos[pos].precioActual);
                    snapshot.ref.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/domicilio').set(dom);
                    var content = 'Total + Domicilio  $';
                    var intTotal = total+dom;
                    content += redondearCifra(intTotal);
                    document.getElementById('canastaText').innerHTML = content;
                   var anim = showCanasta();
                    var tos = new Toasty();
                    tos.show(productos[pos].nombre+" agregado al "+dias[diaRequested-1].dia, 2000);
                    if(productos[pos].tipo==1){
                        snapshot.ref.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/Productos/'+productos[pos].nombre).set({
                                cantidad: productos[pos].actual,
                                descripcion: productos[pos].descPaq,
                                tipo :  productos[pos].tipo,
                                total: productos[pos].precioActual,
                                weburl: productos[pos].url,
                                url: andUrl,
                                uri: 1
                        });
                    cerrarAlert(pos, true);
                }else{
                        snapshot.ref.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/Productos/'+productos[pos].nombre).set({
                                cantidad: productos[pos].actual,
                                descripcion: productos[pos].descPro,
                                tipo :  productos[pos].tipo,
                                total: productos[pos].precioActual,
                                weburl: productos[pos].url,
                                url: andUrl,
                                uri: 1
                    });
            
                }
                    
                    
                    
                }

                
                


                
         });
        }else{
            var tos = new Toasty();
            tos.show("Tu pedido esta en progreso, ve a tu canasta para ver los detalles", 4000);
        }
}


//Orden Management


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
                            var tos = new Toasty();
                            tos.show("Nuestro horario de recepción ha terminado, tu pedido se guardará para la próxima semana", 5000)
                            
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
                //set total from productos
                
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
function grabarOrden(ordenes){
       
        var ref = database.ref('Usuarios/'+user.displayName);
        for(var i = 0; i<ordenes.length;i++){
            ref.child('Suscripcion/Dia/'+ordenes[i].dia+"/estado").set(ordenes[i].orden.estado);
            ref.child('Suscripcion/Dia/'+ordenes[i].dia+"/Hora de entrega").set(ordenes[i].orden.hora);
            ref.child('Suscripcion/Dia/'+ordenes[i].dia+"/status").set(ordenes[i].orden.status);
            ref.child('Suscripcion/Dia/'+ordenes[i].dia+"/Total").set(ordenes[i].orden.total);
            ref.child('Suscripcion/Dia/'+ordenes[i].dia+"/domicilio").set(ordenes[i].orden.domicilio);
            if(ordenes[i].orden.totaldescontado!=0){
                 ref.child('Suscripcion/Dia/'+ordenes[i].dia+"/totalDescontado").set(ordenes[i].orden.totaldescontado);
            }
            for(var j = 0; j<ordenes[i].orden.productos.length;j++){
               
                ref.child('Suscripcion/Dia/'+ordenes[i].dia+"/Productos/"+ordenes[i].orden.productos[j].nombre+"/cantidad").set(ordenes[i].orden.productos[j].cantidad);
                ref.child('Suscripcion/Dia/'+ordenes[i].dia+"/Productos/"+ordenes[i].orden.productos[j].nombre+"/descripcion").set(ordenes[i].orden.productos[j].descripcion);
                ref.child('Suscripcion/Dia/'+ordenes[i].dia+"/Productos/"+ordenes[i].orden.productos[j].nombre+"/tipo").set(ordenes[i].orden.productos[j].tipo);
                ref.child('Suscripcion/Dia/'+ordenes[i].dia+"/Productos/"+ordenes[i].orden.productos[j].nombre+"/url").set(ordenes[i].orden.productos[j].url);
                ref.child('Suscripcion/Dia/'+ordenes[i].dia+"/Productos/"+ordenes[i].orden.productos[j].nombre+"/weburl").set(ordenes[i].orden.productos[j].weburl);
                ref.child('Suscripcion/Dia/'+ordenes[i].dia+"/Productos/"+ordenes[i].orden.productos[j].nombre+"/uri").set(ordenes[i].orden.productos[j].uri);
                ref.child('Suscripcion/Dia/'+ordenes[i].dia+"/Productos/"+ordenes[i].orden.productos[j].nombre+"/total").set(ordenes[i].orden.productos[j].total);
            }
        }
        var refAnon = database.ref('Usuarios/'+anon);
        refAnon.remove();
        id = user.displayName;
        comprobarDireccion();
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
function getViewPaquete(pos){
        productos[pos].tipo = 1;
        var newPrice = productos[pos].precioPaq *  productos[pos].actual;
        productos[pos].precioActual = newPrice;
        var contenido = '<div class="winOrden"><button class="close" onclick="volverAUnidades(';
        contenido += pos;
        contenido += ', false)"></button><img src="';
        contenido += productos[pos].url;
        contenido += '"><h1 id="txtPrecioPaq';
        contenido += pos;
        contenido += '">$';
        contenido +=productos[pos].precioActual;
        contenido +='</h1><ul class="winOrdenDesc"><li id="nombPaq">';
        contenido +=productos[pos].nombre;
        contenido +='</li><li id="descItemEdit">';
        contenido +=productos[pos].descPaq;
        contenido +='</li></ul><div class="calDiv" ><button class="menosButtonPaq" onclick="restar(';
        contenido += pos;
        contenido +=')"></button><h4 id="textCantPaq';
        contenido += pos;
        contenido += '">Cant:';
        contenido += productos[pos].actual;
        contenido += ' paq</h4><button class="masButtonPaq" onclick="sumar(';
        contenido += pos;
        contenido += ')"';
        contenido += '></button></div><button class="ok" onclick="agregar(';
        contenido += pos
        contenido += ')"';
        contenido += '></button></div>';
        document.getElementById("alert").innerHTML= contenido;
        document.getElementById("alert").style.display= "block";
}
function volverAUnidades(pos){
    var newPrice = productos[pos].precioUnidad *  productos[pos].actual;
    productos[pos].precioActual = newPrice;
    cerrarAlert(pos, false);
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
            domi = (total*20)/100;
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
function getCarView(car, pos){
        var content = '<li style="list-style: none; margin-top: 1vw;"><div class="carItemContain"';
        if(car.nombre.length>12){
            if(fromMob){
                content += 'style="height:28vw; "';
            }else{
                content += 'style="height:14vw; "';
            }
        }
        content += '><img src="';
        content += car.weburl;
        content += '"><div class="desc"';
        if(car.nombre.length>12){
            
            content += 'style="padding:0vw 1vw 1vw 1vw;"';
           
        }
        content += '><h1 id="nomCar';
        content += pos;
        content += '" class="n1">';
        content += car.nombre ;
        content += '</h1><h1 id="nomDesc';
        content += pos;
        content += '" class="n2">';
        content += car.descripcion;
        content += '</h1><h1 id="nomCant';
        content += pos;
        content += '" class="n3">Cant: '
        content += car.cantidad;
        content += '</h1><h1 id="nomTot';
        content += pos;
        content += '" class="n4">$'
        content += car.total;
        content += '</h1></div>';
        if(!confirmando){
            content += '<div class="editDiv"><button class="editBtn" onclick="editarItem(';
        content += pos;
        content += ')"></button><button class="removeBtn" onclick="removerItem('; 
        content += pos;
        content += ')"></button></div>';
        }
        
        content += '</div></li>';
        return content;
}
function editarItem(pos){
        editandoItem = true;
        productos  = new Array();
        var cats = ['Aliñados', 'Para Desayunar', 'Dulces', 'Integrales'];
        for(var f=0;f<cats.length;f++){
            var json = productosJson.Categorias[cats[f]];
            var keys = Object.keys(json);
            var pox = 0;
            for(i in json){
                var pro = new producto( keys[pox],
                                        json[i].url, 
                                        json[i].weburl, 
                                        json[i].DescPro, 
                                        json[i].DescPaq, 
                                        parseInt(json[i].precioPaquete,10), 
                                        parseInt(json[i].precioUnidad,10), 
                                        parseInt(json[i].undPorPaq,10), 
                                        pox , 1, 0, parseInt(json[i].precioUnidad,10), false);
                productos.push(pro);
                pox++;
            }

        }
        for(var i=0;i<productos.length;i++){
            if(productos[i].nombre == carList[pos].nombre ){
                var descPro = productos[i].descPro;
                var descPaq =  productos[i].descPaq;
                var preUni =  productos[i].precioUnidad;
                var prePaq =  productos[i].precioPaq;
                var uniPorPaq = productos[i].undPorPaq;
                var newPro = new producto(carList[pos].nombre,
                                            carList[pos].url, 
                                            carList[pos].weburl, 
                                            descPro, 
                                            descPaq, 
                                            prePaq,
                                            preUni, 
                                            uniPorPaq, 
                                            pos,
                                            carList[pos].cantidad, 
                                            carList[pos].tipo,0
                                            , false);
                if(descPaq=="sin descripcion"){
                    newPro.precioActual = preUni * carList[pos].cantidad;
                }else{
                    if(carList[pos].tipo==0){
                        newPro.precioActual = preUni * carList[pos].cantidad;
                    }else{
                        newPro.precioActual = prePaq * carList[pos].cantidad;
                    }
                    
                }
                productos= new Array();
                productos.push(newPro);
                var cont = getModificarView(productos[0], pos);
                document.getElementById("alert").innerHTML= cont;
                document.getElementById("alert").style.display= "block";
                if(descPaq!="sin descripcion"){
                    if(carList[pos].tipo==0){
                        document.getElementById("porUnidad").style.color = "#176559";
                        document.getElementById("porPaquete").style.color = "grey";
                    }else{
                        document.getElementById("porUnidad").style.color = "grey";
                        document.getElementById("porPaquete").style.color = "#176559";
                    }
                }
                break;
            }
        }
}
function getModificarView(producto, pos){
        var contenido = '<div class="winOrden"><button class="close" onclick="cerrarAlert(';
        contenido += 0;
        contenido += ', false)"></button><img src="';
        contenido += producto.url;
        contenido += '"><h1 id="txtPrecioPaq';
        contenido += 0;
        contenido += '">$';
        contenido += producto.precioActual;
        contenido += '</h1><ul class="winOrdenDesc"><li id="nombPaq">';
        contenido += producto.nombre;
        contenido +='</li><li id="descItemEdit">';
        if(producto.tipo ==1){
            contenido +=producto.descPaq;
        }else{
            contenido +=producto.descPro;
        }
        
        contenido +='</li></ul>';
        if(producto.descPaq!="sin descripcion"){
            contenido += '<ul id="modTitles">';
            contenido += '<li id="porUnidad" onclick="setTipo(0)">Por unidad</li><li id="porPaquete"  onclick="setTipo(1)" >Por Paquete</li></ul>';
        
        }
        contenido += '<div class="calDiv" ><button class="menosButtonPaq" onclick="restar(';
        contenido += 0;
        contenido +=')"></button><h4 id="textCantPaq';
        contenido += 0;
        contenido += '">Cant:';
        contenido += producto.actual;
        contenido += ' paq</h4><button class="masButtonPaq" onclick="sumar(';
        contenido += 0;
        contenido += ')"';
        contenido += '></button></div><button class="ok" onclick="agregar(';
        contenido += 0
        contenido += ')"';
        contenido += '></button></div>';
        return contenido;
}
function setTipo(tipo){
        productos[0].tipo = tipo;
        if(tipo==0){
            var total = productos[0].actual * productos[0].precioUnidad;
            productos[0].precioActual = total;
            document.getElementById("textCantPaq"+0).innerHTML ="Cant: "+ productos[0].actual+" unds";
            document.getElementById("txtPrecioPaq"+0).innerHTML ="$"+ total;
            document.getElementById("descItemEdit").innerHTML = productos[0].descPro;
            document.getElementById("porUnidad").style.color = "#176559";
            document.getElementById("porPaquete").style.color = "grey";

        }else{
            var total = productos[0].actual * productos[0].precioPaq;
            productos[0].precioActual = total;
            document.getElementById("descItemEdit").innerHTML = "Paquete "+productos[0].descPaq;
            document.getElementById("textCantPaq"+0).innerHTML ="Cant: "+ productos[0].actual+" paq";
            document.getElementById("txtPrecioPaq"+0).innerHTML ="$"+ total;
            document.getElementById("porUnidad").style.color = "grey";
            document.getElementById("porPaquete").style.color = "#176559";
            
        }
}
function removerItem(pos){
        var dialog = viewDialog("Quieres ", "Sacar este producto?", "src/icons/zero_img.png");
        document.getElementById("alert").innerHTML = dialog;
        document.getElementById("alert").style.display = "block";
        document.getElementById("yesBtn").innerHTML = "Si";
        document.getElementById("yesBtn").addEventListener("click", function(){
            document.getElementById("alert").style.display = "none";
            var ref = database.ref('Usuarios/'+id+'/Suscripcion/Dia/'+dias[diaRequested-1].dia+'/Productos');
            ref.child(carList[pos].nombre).remove();
            var refMarch= database.ref('Marchantes/Main/Ordenes/Reservado/'+dias[diaRequested-1].dia+'/Usuarios/'+id+'/productos');
            refMarch.child(carList[pos].nombre).remove();
            reserva(dias[diaRequested-1].dia);
        });
        document.getElementById("noBtn").innerHTML= "No";
        document.getElementById("noBtn").addEventListener("click", function(){
            document.getElementById("alert").style.display = "none";

        });
}
function comprobarHora(){
        if(!confirmando){

        var ref = database.ref('Usuarios/'+id+'/Suscripcion/Dia/'+dias[diaRequested-1].dia);
        ref.once('value', function(snapshot){
                if(snapshot.child('Hora de entrega').exists()){


                        var hor = parseInt(snapshot.child('Hora de entrega').val(), 10);
                        var med = "";
                        if(hor>12){
                            hor = hor-12;
                            med = " pm";
                        }else{
                            med = " am";
                        }
                        var dialog = viewDialog("Hora de entrega", hor+med+"<br>¿Quieres cambiarla?", "src/icons/zero_img.png");
                        document.getElementById("alert").innerHTML = dialog;
                        document.getElementById("alert").style.display = "block";
                        document.getElementById("yesBtn").innerHTML = "Si";
                        document.getElementById("yesBtn").addEventListener("click", function(){
                                document.getElementById("alert").style.display = "none";
                                showTimePicker();
                        
                        });
                        document.getElementById("noBtn").innerHTML= "No";
                        document.getElementById("noBtn").addEventListener("click", function(){
                                document.getElementById("alert").style.display = "none";
                                if(guardando||confirmar){
                                    comprobarDireccion();
                                }

                        });

                }else{
                    showTimePicker();
                }
        });
        }
}
function showTimePicker(){
        var tomorrow = diaActual+1;
        if(tomorrow>7){
            tomorrow = 1;
        }

        var horas = new Array();
        document.getElementById("alert").style.display= "block";
        document.getElementById("alert").innerHTML= '<div id="clockCont"></div>';

        if(diaRequested==tomorrow){
            if(diaActual==1){
                if(horaActual>=11){
                    horas = [2 , 3 , 4, 5];
                }else{
                    horas = [7, 8, 9, 10, 2 , 3 , 4, 5];
                }
            }else{
                if(horaActual>=17){
                    horas = [2 , 3 , 4, 5];
                }else{
                    horas = [7, 8, 9, 10, 2 , 3 , 4, 5];
                }
            }
            
            
        }else if(diaActual==diaRequested){
            if(horaActual<=10){
                horas = [2 , 3 , 4, 5];
            }else if(horaActual==11){
                horas = [3 , 4, 5];
            }else if(horaActual==12){
                horas = [4, 5];
            }else if(horaActual>=13){
                horas = ["No puedes pedir"];
            }

        }else{
            horas = [7, 8, 9, 10, 2 , 3 , 4, 5];
        }
        if(horas[0]=="No puedes pedir"){
            horas = [7, 8, 9, 10, 2 , 3 , 4, 5];
            if(!fromMob){
                var cont = getClockView(horas);
            }else{
                var cont = getClockViewMob(horas);
            }
            
        document.getElementById("clockCont").innerHTML = cont;
        document.getElementById("guardarHora").addEventListener("click", guardarHora);
    
            for(var i=0; i<horas.length;i++){
            document.getElementById("hora"+horas[i]).style.color = "#df7233";
            }
            var tos = new Toasty();
            tos.show("Tu pedido se guardará para la proxima semana", 3000);
            

        }else{
            if(!fromMob){
                var cont = getClockView(horas);
            }else{
                var cont = getClockViewMob(horas);
            }
        document.getElementById("clockCont").innerHTML = cont;
        document.getElementById("guardarHora").addEventListener("click", guardarHora);
    
            for(var i=0; i<horas.length;i++){
            document.getElementById("hora"+horas[i]).style.color = "#df7233";
        }
        }
}
function guardarHora(){
        if(hasChossenHour){
            if(reqHora != null){
                var ref = firebase.database().ref('Usuarios/'+id+'/Suscripcion/Dia/'+dias[diaRequested-1].dia);
                var newHour;
                if(reqHora<6){
                    document.getElementById("horaEntrega").innerHTML= "Hora de entrega<br>" + reqHora + " pm";
                    newHour = reqHora + 12;
                }else{
                    newHour = reqHora;
                    document.getElementById("horaEntrega").innerHTML= "Hora de entrega<br>" + reqHora + " am";
                }
                ref.child('Hora de entrega').set(newHour);
                document.getElementById("alert").style.display= "none";
               
                if(guardando||confirmar){
                    comprobarDireccion();
                }else{
                    reserva(dias[diaRequested-1].dia);
                }
                
            }
        }else{
           
        }
}
function showDirecciones(){
        var ref= database.ref('Usuarios/'+id+'/things/Direcciones');
        ref.once('value', function(snapshot){
            if(snapshot.exists()){
                dirs = new Array();
                snapshot.forEach(function(direxion){
                    var titulo = direxion.child('titulo').val();
                    var dir = direxion.child('direccion').val();
                    var lat=  direxion.child('lat').val();
                    var long=  direxion.child('long').val();
                    var pos = direxion.key;
                    var newDir = new direccion(titulo, dir,lat, long, pos);
                    dirs.push(newDir);
                });
                var cont = '<div class="direcciones"><div class="titleDireccion"><button class="closeLeft" onclick="cerrarReloj()"></button><h1>Elige una Ubicación</h1></div><ul  id="dirList"></ul><div class="dirFoot"><button id="agregarNueva" onclick="showAddDirec()">Agregar nueva</button></div></div>';
                document.getElementById("alert").innerHTML = cont;
                document.getElementById("alert").style.display = "block";
                var dir = "";
                for(var i=0; i<dirs.length;i++){
                    dir+= getDireccionView(dirs[i]);
                }
                document.getElementById("dirList").innerHTML= dir;
            }else{
                showAddDirec();
                
                
            }
            
            
        });
}
function editarDir(pos){
        var cont = viewEditDirec("Edita tu dirección", dirs[pos].titulo , "Ej: Cr 15 # 8-22");
        document.getElementById("alert").innerHTML= cont;
        document.getElementById("alert").style.display="block";

        var input = document.getElementById("newDir");
        input.value = dirs[pos].direccion; 
        document.getElementById("yesBtn").innerHTML = "Guardar";
        document.getElementById("yesBtn").addEventListener("click", function(){
            document.getElementById("alert").style.display = "none";
            var input = document.getElementById("newDir");
            var ref = database.ref('Usuarios/'+id);
            ref.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/Direccion de entrega').set(input.value);
            ref.child('things/Direcciones/'+dirs[pos].pos+'/direccion').set(input.value);
            reserva(dias[diaRequested-1].dia);
            
        });
        document.getElementById("noBtn").innerHTML= "Cerrar";
        document.getElementById("noBtn").addEventListener("click", function(){
            document.getElementById("alert").style.display = "none";

        });
       
}
function showAddDirec(){
        var ref = database.ref('Usuarios/'+id+'/things/Direcciones');
        ref.once('value', function(snapshot){
                var pos= 1;
                if(snapshot.exists()){
                    snapshot.forEach(function(dir){
                    pos++;
                });
                }
                
                var cont = viewEditDirec("Edita tu dirección","¿Lugar, Ej: Casa, Trabajo...", "Ej: Cr 15 # 8-22");
                document.getElementById("alert").innerHTML= cont;
                document.getElementById("alert").style.display="block";

                var input = document.getElementById("newDir");
                var inputTitle = document.getElementById("newDirTitle");
                input.value = ""; 
                inputTitle.value = "";
                document.getElementById("yesBtn").innerHTML = "Guardar";
                document.getElementById("yesBtn").addEventListener("click", function(){
                    document.getElementById("alert").style.display = "none";
                    var input = document.getElementById("newDir");
                    var inputTitle = document.getElementById("newDirTitle");
                    var ref = database.ref('Usuarios/'+id);
                    ref.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/Direccion de entrega').set(input.value);
                    ref.child('things/Direcciones/'+pos+'/direccion').set(input.value);
                    ref.child('things/Direcciones/'+pos+'/titulo').set(inputTitle.value);
                    ref.child('things/Direcciones/'+pos+'/domicilio').set(100);
                    ref.child('things/Direcciones/'+pos+'/lat').set(0.0);
                    ref.child('things/Direcciones/'+pos+'/long').set(0.0);
                    if(guardando||confirmar){
                        getOrden();
                    }else{
                        reserva(dias[diaRequested-1].dia);
                    }
                    
                    
                });
                document.getElementById("noBtn").innerHTML= "Cerrar";
                document.getElementById("noBtn").addEventListener("click", function(){
                document.getElementById("alert").style.display = "none";

            });


        });
}
function borrarDir(pos){}
function selectDir(pos){
        document.getElementById("dirTxt").innerHTML = dirs[pos].direccion;
        document.getElementById("alert").style.display = "none";
        var ref = database.ref('Usuarios/'+id+'/Suscripcion/Dia/'+dias[diaRequested-1].dia);
        ref.child('Direccion de entrega').set(dirs[pos].direccion);
        ref.child('lat').set(dirs[pos].lat);
        ref.child('long').set(dirs[pos].long);
        if(guardando||confirmar){
            getOrden();

        }else{
            reserva(dias[diaRequested-1].dia);
        }
}   
function cerrarReloj(){document.getElementById("alert").style.display = "none";}
function selectNum(pos){
        hasChossenHour = true;
        if(reqHora !=null){

            document.getElementById("hora"+reqHora).style.color = "#df7233";
            document.getElementById("hora"+reqHora).style.backgroundImage = "";
            reqHora = pos;
        }
        document.getElementById("hora"+pos).style.color = "#ffffff";
        document.getElementById("hora"+pos).style.backgroundImage = "url('src/icons/green_point.png')";
        reqHora = pos;
        if(reqHora>6){
            document.getElementById("horaActual").innerHTML = reqHora +" am";
        }else{
            document.getElementById("horaActual").innerHTML = reqHora +" pm";
        }
        
       
}
function comprobarDireccion(){
        if(user != null){
            if(!confirmando){
                var ref = database.ref('Usuarios/'+id+'/Suscripcion/Dia/'+dias[diaRequested-1].dia+'/Direccion de entrega');
                ref.once('value', function(snapshot){
                if(snapshot.exists()){
                    var direc = snapshot.val();
                    var dialog = viewDialog("Direccion de entrega", direc+"<br>¿Quieres cambiarla?", "src/icons/zero_img.png");
                        document.getElementById("alert").innerHTML = dialog;
                        document.getElementById("alert").style.display = "block";
                        document.getElementById("yesBtn").innerHTML = "Si";
                        document.getElementById("yesBtn").addEventListener("click", function(){
                                document.getElementById("alert").style.display = "none";
                                showDirecciones();
                        
                        });
                        document.getElementById("noBtn").innerHTML= "No";
                        document.getElementById("noBtn").addEventListener("click", function(){
                        document.getElementById("alert").style.display = "none";
                            if(guardando||confirmar){
                                    getOrden();
                            }

                    });

                    

                }else{  

                showDirecciones();
            }
        });
            }
            
        }else{
            showAuthDialog();

        }
}
function guardarOrden(){
        if(confirmando){
            showProgressDialog();
        }else{
            var ref = database.ref('Usuarios/'+id+'/Suscripcion/Dia/'+dias[diaRequested-1].dia);
            ref.once('value', function(snapshot){
                var total = parseInt(snapshot.child('Total').val(), 10);
                if(total>=2000){
                    if(diaRequested!=diaActual){
                        guardando = true;
                    }else{
                        confirmar = true;
                    }
                   
                    if(marchante==null||marchante==""){
                        askForMarchante();
                    }else{
                        askForCupones(cuponActivo);
                    }
                    
                           
                }else{
                    fromDay =true;
                    var tos = new Toasty();
                    tos.show("Pide almenos $2000 pesos en productos", 4000);
                    goMain();
                }
            });
            
        }
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
function getOrden(){
       
        var ref = firebase.database().ref('Usuarios/'+id+'/Suscripcion/Dia/'+dias[diaRequested-1].dia);
        ref.once('value', function(snapshot){
            if(confirmar){
                snapshot.ref.child('estado').set("confirmando");
                var tos = new Toasty();
                tos.show("Tu orden fué confirmada", 2000);
            }else{
                var tos = new Toasty();
                tos.show("Tu orden está guardada", 2000);
                snapshot.ref.child('estado').set("guardado");
            }
            
            var hora = snapshot.child('Hora de entrega').val();
            var direc = new direccion("dir", snapshot.child('Direccion de entrega').val(), 0.0, 0.0, 0); 
            var total = snapshot.child('Total').val();
            var domicilio = snapshot.child('domicilio').val();
            var totalDescontado;
            if(snapshot.child('totalDescontado').exists()){
                totalDescontado = snapshot.child('totalDescontado').val();
            }else{
                totalDescontado = 0;
            }
            
           
            var estado = snapshot.child('estado').val();
            var status = snapshot.child('status').val();
            carList = new Array();

            snapshot.child('Productos').forEach(function(prod){
                var totPro = prod.child('total').val();
                var cant = prod.child('cantidad').val();
                var desc = prod.child('descripcion').val();
                var url = prod.child('url').val();
                var weburl = prod.child('weburl').val();
                var nombre = prod.key;
                var tipo = prod.child('tipo').val();
                var newProd = new carItem(nombre, desc, tipo, cant, totPro, weburl, url, 1);
                carList.push(newProd);

            }); 

            var ord = new orden(hora, direc, total, domicilio, totalDescontado, estado, status, carList);
            
            grabarEnMarchante(ord);

            
            

        });
}
window.onload = s; 
function grabarEnMarchante(ord){
        if(confirmar){
            var refOrden = database.ref('Marchantes/Main/Ordenes/Pendientes');
            refOrden.once('value', function(snapshot){
                var index = parseInt(snapshot.child('index').val(), 10);
                index++;
                snapshot.ref.child('index').set(index);
               
                snapshot.ref.child('enCurso/'+index+'/dia').set(dias[diaRequested-1].dia);
                snapshot.ref.child('enCurso/'+index+'/total').set(ord.total);
                snapshot.ref.child('enCurso/'+index+'/tipo').set(0);
                snapshot.ref.child('enCurso/'+index+'/direccion').set(ord.direccion.direccion);
                snapshot.ref.child('enCurso/'+index+'/lat').set(ord.direccion.lat);
                snapshot.ref.child('enCurso/'+index+'/long').set(ord.direccion.long);
                snapshot.ref.child('enCurso/'+index+'/domicilio').set(ord.domicilio);
                snapshot.ref.child('enCurso/'+index+'/estado').set("si");
                snapshot.ref.child('enCurso/'+index+'/status').set(0);
                snapshot.ref.child('enCurso/'+index+'/hora').set(ord.hora);
                snapshot.ref.child('enCurso/'+index+'/titular').set(id);
                snapshot.ref.child('enCurso/'+index+'/marchante').set(marchante);
                snapshot.ref.child('enCurso/'+index+'/fecha').set(getFecha());
                snapshot.ref.child('enCurso/'+index+'/dia').set(dias[diaRequested-1].dia);
                if(ord.totaldescontado !=0){
                    snapshot.ref.child('enCurso/'+index+'/totalDescontado').set(ord.totaldescontado);
                }
                snapshot.ref.child('enCurso/'+index+'/Usuarios/'+id+'/total').set(ord.total);
                snapshot.ref.child('enCurso/'+index+'/Usuarios/'+id+'/domicilio').set(ord.domicilio);
                for(var i=0; i<ord.productos.length;i++){
                snapshot.ref.child('enCurso/'+index+'/Usuarios/'+id+'/productos/'+ord.productos[i].nombre+'/cantidad').set(ord.productos[i].cantidad);
                snapshot.ref.child('enCurso/'+index+'/Usuarios/'+id+'/productos/'+ord.productos[i].nombre+'/total').set(ord.productos[i].total);
                snapshot.ref.child('enCurso/'+index+'/Usuarios/'+id+'/productos/'+ord.productos[i].nombre+'/descripcion').set(ord.productos[i].descripcion);
                snapshot.ref.child('enCurso/'+index+'/Usuarios/'+id+'/productos/'+ord.productos[i].nombre+'/tipo').set(ord.productos[i].tipo);
                }
                document.getElementById("guardarBtn").style.backgroundColor = "#73ba40";
                document.getElementById("guardarBtn").innerHTML = "Confirmando...";

                guardando = false;
                confirmar = false;
                setIdEntrega(index);
                });
            

        }else{
            ref = database.ref('Marchantes/Main/Ordenes/Reservado/'+dias[diaRequested-1].dia+'/Usuarios/'+id);
            ref.child('dia').set(dias[diaRequested-1].dia);
            ref.child('marchante').set(marchante);
            ref.child('total').set(ord.total);
            ref.child('tipo').set(0);
            ref.child('direccion').set(ord.direccion.direccion);
            ref.child('lat').set(ord.direccion.lat);
            ref.child('long').set(ord.direccion.long);
            ref.child('domicilio').set(ord.domicilio);
            ref.child('estado').set("guardado");
            ref.child('status').set(0);
            ref.child('hora').set(ord.hora);
            ref.child('tipo').set(0);
            if(ord.totaldescontado !=0){
                ref.child('totalDescontado').set(ord.totaldescontado);
            }
            for(var i=0; i<ord.productos.length;i++){
                ref.child('productos/'+ord.productos[i].nombre+'/cantidad').set(ord.productos[i].cantidad);
                ref.child('productos/'+ord.productos[i].nombre+'/total').set(ord.productos[i].total);
                ref.child('productos/'+ord.productos[i].nombre+'/descripcion').set(ord.productos[i].descripcion);
                ref.child('productos/'+ord.productos[i].nombre+'/tipo').set(ord.productos[i].tipo);
            }
            document.getElementById("guardarBtn").style.backgroundColor = "#73ba40";
            document.getElementById("guardarBtn").innerHTML = "Guardado";

            guardando = false;
        }
        
       
}
function setIdEntrega(index){
        var ref = firebase.database().ref('Usuarios/'+id+'/Suscripcion/Dia/'+dias[diaRequested-1].dia);
        ref.child('ID_ENTREGA').set(index);
        var tos = new Toasty();
        tos.show("Tu orden fué confirmada", 2000);
        reserva(dias[diaRequested-1].dia);
}
function removeDia(){
       
        if(!confirmando){
        var dialog = viewDialog("Quieres ", "Borrar esta orden?", "src/icons/zero_img.png");
        document.getElementById("alert").innerHTML = dialog;
        document.getElementById("alert").style.display = "block";
        document.getElementById("yesBtn").innerHTML = "Si";
        document.getElementById("yesBtn").addEventListener("click", function(){
            document.getElementById("alert").style.display = "none";
            var ref = database.ref('Usuarios/'+id+'/Suscripcion/Dia/'+dias[diaRequested-1].dia);
            ref.once('value', function(snapshot){
                if(snapshot.child('Cupon').exists()){
                    snapshot.ref.remove();
                    resetCupon(snapshot.child('Cupon/index').val());

                }else{
                    snapshot.ref.remove();
                    goMain();
                }
            });
            
            
            
        });
        document.getElementById("noBtn").innerHTML= "No";
        document.getElementById("noBtn").addEventListener("click", function(){
            document.getElementById("alert").style.display = "none";

        });
        }else{
            var tos= new Toasty();
            tos.show("No puedes borrar una orden en progreso", 3000);
        }
} 
function resetCupon(index){
        var ref  = database.ref('Usuarios/'+id+'/Cupones');
        ref.child(index+"/state").set(true);
        
        goMain();
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
                            if(guardando||confirmar){
                                comprobarHora();
                            }
            
                            });
                        }else{
                            comprobarHora();
                        }
                }else{
                        comprobarHora();
                }
                    }else{
                    var tos = new Toasty();
                    tos.show("Canjea el cupón disponible", 2000);
                }
            }else{
                if(guardando||confirmar){
                    comprobarHora();
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
                comprobarHora();
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
                   
                    var cup = new cupon(valor, stat, parseInt(cupo.key, 10));
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
                reserva(dias[diaRequested-1].dia);
            }
           
        });
}


//Alertas, Notifications, dialogs


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

//Dummies


function cupon(valor, state, pos){
        this.valor = valor;
        this.state = state;
        this.pos = pos;
}
function producto(nombre, andUrl, url, descPro, descPaq, precioPaq, precioUnidad, undPorPaq, pos, actual, tipo, precioActual, isTaken){
        this.nombre= nombre;
        this.andUrl = andUrl;
        this.url = url;
        this.descPro = descPro;
        this.descPaq = descPaq;
        this.precioPaq = precioPaq;
        this.precioUnidad = precioUnidad;
        this.undPorPaq = undPorPaq;
        this.pos = pos;
        this.actual = actual;
        this.tipo = tipo;
        this.precioActual = precioActual;
        this.isTaken = isTaken;
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
function direccion(titulo, direccion, lat, long, pos){
        this.titulo = titulo;
        this.direccion = direccion;
        this.lat = lat;
        this.long = long;
        this.pos = pos;
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


//Model Views


function getClockViewMob(horas){
        var content = '<button class="close" onclick="cerrarReloj()"></button><h1 class="clockTitle">Elige la hora</h1><div class="clockLine" style="margin-top: 6vw;"><h1 id="hora12"';
        content += '>12</h1></div><div class="clockLine" style="margin-top: -1.2vw;"><h1 id="hora11" ';
         
        content +=  '>11</h1><h1 id="hora1"';
        
        content +=  'style="margin-left: 20vw;">1</h1></div><div style="margin-top:2vw;" class="clockLine"><h1 id="hora10"';
         for(var i=0; i<horas.length;i++){
            if(horas[i]==10){
                content += 'onclick="selectNum(10)"';
            }
         }
         content += '>10</h1><h1 id="hora2"';
         for(var i=0; i<horas.length;i++){
            if(horas[i]==2){
                content += 'onclick="selectNum(2)"';
            }
         }
        
         content += 'style="margin-left: 38vw;">2</h1></div><div class="clockLine" style="margin-top: 3.8vw; margin-bottom: 1.8vw;"><h1  id="hora9"'; 
         for(var i=0; i<horas.length;i++){
            if(horas[i]==9){
                content += 'onclick="selectNum(9)"';
            }
         }
        
        content +=  '>9</h1><h1  id="hora3" ';
        for(var i=0; i<horas.length;i++){
            if(horas[i]==3){
                content += 'onclick="selectNum(3)"';
            }
         }
        content +=  'style="margin-left: 48vw;">3</h1></div><div class="clockLine" style="margin-top:3.8vw;"><h1  id="hora8" ';
        for(var i=0; i<horas.length;i++){
            if(horas[i]==8){
                content += 'onclick="selectNum(8)"';
            }
         }
         content += '>8</h1><h1  id="hora4" ';
         for(var i=0; i<horas.length;i++){
            if(horas[i]==4){
                content += 'onclick="selectNum(4)"';
            }
         }
         content += ' style="margin-left: 38vw;">4</h1></div><div class="clockLine"   style="margin-top: 2.2vw;"><h1  id="hora7" ';
         for(var i=0; i<horas.length;i++){
            if(horas[i]==7){
                content += 'onclick="selectNum(7)"';
            }
         }
         content += '>7</h1><h1  id="hora5"';
         for(var i=0; i<horas.length;i++){
            if(horas[i]==5){
                content += 'onclick="selectNum(5)"';
            }
         }
         content += ' style="margin-left: 20vw;">5</h1></div><div class="clockLine" style="margin-top: 1vw;"><h1  id="hora6" ';
         content += '>6</h1></div><h1 id="horaActual"></h1><button id="guardarHora">Guardar</button>';
         return content;    
}
function getClockView(horas){
    var content = '<button class="close" onclick="cerrarReloj()"></button><h1 class="clockTitle">Elige la hora</h1><div class="clockLine" style="margin-top: 2vw;"><h1 id="hora12"';
        content += '>12</h1></div><div class="clockLine" style="margin-top: -0.8vw;"><h1 id="hora11" ';
         
        content +=  '>11</h1><h1 id="hora1"';
        
        content +=  'style="margin-left: 9vw;">1</h1></div><div class="clockLine"><h1 id="hora10"';
         for(var i=0; i<horas.length;i++){
            if(horas[i]==10){
                content += 'onclick="selectNum(10)"';
            }
         }
         content += '>10</h1><h1 id="hora2"';
         for(var i=0; i<horas.length;i++){
            if(horas[i]==2){
                content += 'onclick="selectNum(2)"';
            }
         }
        
         content += 'style="margin-left: 16.6vw;">2</h1></div><div class="clockLine" style="margin-top: 1.8vw; margin-bottom: 1.8vw;"><h1  id="hora9"'; 
         for(var i=0; i<horas.length;i++){
            if(horas[i]==9){
                content += 'onclick="selectNum(9)"';
            }
         }
        
        content +=  '>9</h1><h1  id="hora3" ';
        for(var i=0; i<horas.length;i++){
            if(horas[i]==3){
                content += 'onclick="selectNum(3)"';
            }
         }
        content +=  'style="margin-left: 21vw;">3</h1></div><div class="clockLine"><h1 id="hora8" ';
        for(var i=0; i<horas.length;i++){
            if(horas[i]==8){
                content += 'onclick="selectNum(8)"';
            }
         }
         content += '>8</h1><h1  id="hora4" ';
         for(var i=0; i<horas.length;i++){
            if(horas[i]==4){
                content += 'onclick="selectNum(4)"';
            }
         }
         content += ' style="margin-left: 16.6vw;">4</h1></div><div class="clockLine"   style="margin-top: 0.6vw;"><h1  id="hora7" ';
         for(var i=0; i<horas.length;i++){
            if(horas[i]==7){
                content += 'onclick="selectNum(7)"';
            }
         }
         content += '>7</h1><h1  id="hora5"';
         for(var i=0; i<horas.length;i++){
            if(horas[i]==5){
                content += 'onclick="selectNum(5)"';
            }
         }
         content += ' style="margin-left: 9vw;">5</h1></div><div class="clockLine" style="margin-top: -0.2vw;"><h1  id="hora6" ';
         content += '>6</h1></div><h1 id="horaActual"></h1><button id="guardarHora">Guardar</button>';
         return content;
}
function getDireccionView(direccion){
        var cont = '<li class="dirItem"><div  style="display: flex;"><div class="contADir"><h1>';
        cont += direccion.titulo;
        cont += '</h1><h2>';
        cont += direccion.direccion;
        cont +='</h2></div><div class="contBDir"><button onclick="editarDir(';
        cont += direccion.pos-1;
        cont +=')"style="background-image: url(';
        cont += "'src/icons/edit_wand.png'";
        cont += ');"></button><button onclick="borrarDir(';
        cont += direccion.pos-1;
        cont += ')" style="display:none;background-image: url('
        cont +="'src/icons/cancel_btn_grey.png'";
        cont +=');"></button><button onclick="selectDir(';
        cont += direccion.pos-1;
        cont += ')" style="background-image: url('
        cont += "'src/icons/simple_ok_green.png'";
        cont +=');"></button></div></div></li>';
        return cont;
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
function viewEditDirec(titulo, contenido, placeholder){
        var contentDialog = '<div id="dialog" ><h1 >';
        contentDialog += titulo;
        contentDialog += '</h1><p >';
        contentDialog += '<input type="text" placeholder="'+contenido+'" id="newDirTitle"></br>';
        contentDialog += '</p>';
        contentDialog += '<input type="text" placeholder="'+placeholder+'" id="newDir"></br>';
        contentDialog += '<div class="dialogBtnCont"><button id="noBtn" class="noBtn">';
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
                cont += 'src/icons/cupon_box_clear.png';
            }else{
                cont += 'src/icons/cupon_box.png';
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
function getView(producto){
        var contenido = '<li ><div class="producto"><div class="prodContA"';
        if(!fromMob){
            contenido += 'onclick="showB(';
            
        }else{
             contenido += 'onclick="showB(';
        }
        contenido += producto.pos;
        contenido += ')"';
        contenido += '>';
        contenido += '<img src="';
        contenido += producto.url ;
        
        contenido += '"><h1>';
        contenido += producto.nombre;
        
        if(producto.isTaken){
            if(!fromMob){
                contenido += '</h1><p style="color: #df7233; margin-top: -0.8vw; font-size: 1.6vw;">';
        
            }else{
                contenido += '</h1><p style="color: #df7233; margin-top: -4vw; font-size: 5vw;">';
        
            }
                contenido += "Pedido";
        }else{
            contenido += '</h1><p>';
            contenido += producto.descPro;
        }
        
        contenido += '</p></div><div ';
        contenido += ' id="prod'+producto.pos+'" ';
             
        contenido +='class="prodContB">';

        if(producto.descPaq != "sin descripcion"){
            contenido += '<div class="btnPaquete" onclick="getViewPaquete(';
            contenido += producto.pos;
            contenido += ')"><h1>';
            contenido += 'Paq ';
            contenido += producto.descPaq;
            contenido += '</h1><h2>$'; 
            contenido += producto.precioPaq; 
            contenido += '</h2></div>';
        }
        contenido += '<div class="precio"';
        if(producto.descPaq == "sin descripcion"){
            if(fromMob){
                contenido += 'style="margin-top:10vw;"';
            }else{
                contenido += 'style="margin-top:4vw;"';
            }
            
        }
        contenido +='><h1>';
        contenido += "Precio";
        contenido += '</h1><h1>x</h1><h1 id="und';
        contenido += producto.pos;
        contenido += '">';
        contenido += 1;
        contenido += 'und</h1></div><div class="calCont"><button class="menosButton" onclick="restar(';
        contenido += producto.pos;
        contenido += ')"></button><h1 id="price';
        contenido += producto.pos;
        contenido += '">$';
        contenido += producto.precioUnidad;
        contenido += '</h1><button class="masButton" onclick="sumar(';
        contenido += producto.pos;
        contenido += ')"></button></div><h1 class="aceptar" onclick="agregar(';
        contenido += producto.pos;
        contenido +=')">Agregar</h1><button class="closeB" onclick="hideB(';
        contenido += producto.pos;
        contenido +=')"></button></div></div></li>';
        return contenido;
}


//Sharing, Social Media


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
        shareInt();
}
function shareInt(){
       if (navigator.share) {
        navigator.share({
            title: 'Hola, quiero compartir',
            text: 'esta fantástica Panaderia contigo',
            url: 'https://today-6648d.firebaseapp.com',
        }).then(() =>console.log(''))
        .catch((error) => console.log('Error sharing', error));
        }else{
             var tos = new Toasty();
             tos.show("El enlace se copió en el portapapeles, compartelo con tus amigos para ganar descuentos y promociones!!", 5000);
             
        }
}

//System Data, resources


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
    hi();
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

function getProductosJson(){
    if(!productosJson){
        readFromJson('/json/Productos.json', function(response){
            if(response){
                var json = JSON.parse(response);
                productosJson = json;
               
                
            }
            checkAndSetProductosDb();
            
        });
    }else{
        cargarProductos('Para Desayunar');
    }
    
}
function checkAndSetProductosDb(){
    if(('indexedDB' in window)){
        var dbPromise = window.indexedDB.open('productos', 1);
        var prom = new Promise(function(response){
            var x = false;
            var timer = setTimeout(function(){
                if(!x){
                    response('no respuesta');
                }else{
                 
                }
            }, 1000);
            dbPromise.onupgradeneeded = function(event){
               
                var db = event.target.result;
                x = true;
                var create = db.createObjectStore('productos', {keyPath: 'id', autoIncrement: true} );
                create.transaction.oncomplete = function(){
                    var objStore = db.transaction(['productos'], "readwrite").objectStore('productos');      
                    var data = {
                        id: 'productos',
                        data: productosJson
                    }
                    var req = objStore.put(data);
                    req.onsuccess = function(){
                        
                        clearTimeout(timer);
                        response('respondio');
                    };
                }
            
                            
            };
            
            
        });
        prom.then(function(res){
           
            if(res=='respondio'){
                cargarProductos('Para Desayunar');
            }else{
                readProdsInDb();
            }
        });
        
        
    }else{
        cargarProductos('Para Desayunar');
    }
}
function  readProdsInDb(){
    var dbPromise = window.indexedDB.open('productos', 1);
    dbPromise.onsuccess = function(event){
               
                var db = event.target.result;
                var store = db.transaction(['productos'], "readwrite").objectStore('productos');
                var data = store.get('productos');
                data.onsuccess = function(event){
                                if(data.result.data){
                                    productosJson = data.result.data;
                                    cargarProductos('Para Desayunar');
                                }else{
                                    getProductosJson();
                                }
                            };
                
                        
            };
}
function cargarProductos(reference){
        categoria = reference;
        document.getElementById("cateActual").innerHTML = reference;
        productos = new Array();
        if(productosJson){
            var json = productosJson.Categorias[reference];
            var pos = 0;
            var keys = Object.keys(json);
            for(i in json){
                var pro = new producto( keys[pos],
                                        json[i].url, 
                                        json[i].weburl, 
                                        json[i].DescPro, 
                                        json[i].DescPaq, 
                                        parseInt(json[i].precioPaquete,10), 
                                        parseInt(json[i].precioUnidad,10), 
                                        parseInt(json[i].undPorPaq,10), 
                                        pos , 1, 0, parseInt(json[i].precioUnidad,10), false);
                productos[pos] = pro;
                pos++;

            }
            mostrarProductos(true);

            
           
        }else{
            getProductosJson();
            /*var ref = database.ref('Productos/Categorias/'+reference);
            ref.once('value', function(snapshot){
                var pos = 0;
                snapshot.forEach(function(childSnapshot) {
                    var descPaq = childSnapshot.child("DescPaq").val();
                    var descPro = childSnapshot.child("DescPro").val();
                    var andUrl= childSnapshot.child("url").val();
                    var precioPaq = parseInt(childSnapshot.child("precioPaquete").val(),10);
                    var precioUnd = parseInt(childSnapshot.child("precioUnidad").val(),10);
                    var undPorPaq = parseInt(childSnapshot.child("undPorPaq").val(),10);
                    var url = childSnapshot.child("weburl").val();
                    var nombre = childSnapshot.key;
                    var pro = new producto(nombre, andUrl, url, descPro, descPaq, precioPaq, precioUnd, undPorPaq, pos , 1, 0, precioUnd, false);
                    productos[pos] = pro;
                    pos++;
                    
                });
            
                mostrarProductos(true);

            });*/
        }
        
}

function readFromJson(path, callback){
    var xobj = new XMLHttpRequest();
    xobj.open('GET', path, true); 
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
          }
    };
    xobj.send(null); 
}

    






 
