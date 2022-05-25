$("#about").on("click", () => {
  $("#mainDiv").empty();
  $("#searchHere").empty();
  $("#mainDiv").append(`<div class="about">
    <div class="about-container">
        <div class="img-container">
            <img src="images/aboutPic.jpeg" alt="">
        </div>
    <div class="text-container">
        <h1>About The Project</h1>
        <p> In this project you can track your favorite CryptoCurrency. <br/> This project was made with jQuery, designed with bootstrap and my AWESOME css skills😆. <br/> I hope you will enjoy it & I hope I'll get an <span>  A </span>😜! </p>
        <span><img src="images/html.png"><img src="images/jquery.png"><img src="images/css.png"><img src="images/bootstrap.png"><span/>
    </div>
    </div>
</div>`);
});
