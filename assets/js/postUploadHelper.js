document.getElementById('upload').onchange = evt=>{
    const [file] = document.getElementById('upload').files;
    if(file){
        //document.getElementById('uploadedArt').src = URL.createObjectURL(file);
        document.getElementById('uploadedArt2').src = URL.createObjectURL(file);
    }
}