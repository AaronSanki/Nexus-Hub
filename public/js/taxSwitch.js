let taxSwitch = document.getElementById("flexSwitchCheckDefault");
        taxSwitch.addEventListener("click", ()=>{
            let taxInfo = document.getElementsByClassName("tax-info");
            for(info of taxInfo){
                if(info.style.display === "inline"){
                    info.style.display = "none";
                }
                else{
                    info.style.display = "inline";
                }
            }
        });