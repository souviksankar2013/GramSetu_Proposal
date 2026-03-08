function login(){

    const url =
    `${config.cognitoDomain}/login?client_id=${config.clientId}&response_type=token&scope=email+openid&redirect_uri=${config.redirectUri}`;
    
    window.location.href = url;
    
    }
    
    function logout(){
    
    localStorage.removeItem("token");
    
    window.location.href =
    `${config.cognitoDomain}/logout?client_id=${config.clientId}&logout_uri=${config.redirectUri}`;
    
    }
    
    function getTokenFromUrl(){
    
    const hash = window.location.hash;
    
    if(hash.includes("access_token")){
    
    const token = hash.split("access_token=")[1].split("&")[0];
    
    localStorage.setItem("token", token);
    
    window.location.hash="";
    
    }
    
    }
    
    async function placeOrder(){
    
    const token = localStorage.getItem("token");
    
    if(!token){
    alert("Please login first");
    return;
    }
    
    const body = {
    
    productId: document.getElementById("productId").value,
    farmerId: document.getElementById("farmerId").value,
    gridId: document.getElementById("gridId").value,
    quantity: document.getElementById("quantity").value
    
    };
    
    const res = await fetch(config.apiEndpoint,{
    
    method:"POST",
    
    headers:{
    "Content-Type":"application/json",
    "Authorization":token
    },
    
    body:JSON.stringify(body)
    
    });
    
    const data = await res.json();
    
    document.getElementById("msg").innerText = JSON.stringify(data);
    
    }
    
    function checkLogin(){
    
    const token = localStorage.getItem("token");
    
    if(token){
    document.getElementById("orderSection").style.display="block";
    }
    
    }
    
    getTokenFromUrl();
    checkLogin();