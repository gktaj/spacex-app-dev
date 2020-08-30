window.addEventListener('DOMContentLoaded', () => {
    var loadList = document.querySelector('.postList');
    var dateFilter = document.querySelectorAll('.yearfilter input');
    var launchFilter = document.querySelectorAll('.launchfilter input');
    var landFilter = document.querySelectorAll('.landfilter input');
    var qs = (function(a) {
        if (a == "") return {};
        var b = {};
        for (var i = 0; i < a.length; ++i)
        {
            var p=a[i].split('=', 2);
            if (p.length == 1)
                b[p[0]] = "";
            else
                b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    })(window.location.search.substr(1).split('&'));
    launchFilter.forEach((el,ind)=>{
        if(el.value===qs.launch_success){
            el.checked="true"
        }
    })
    landFilter.forEach((el,ind)=>{
        if(el.value===qs.land_success){
            el.checked="true"
        }
    })
    dateFilter.forEach((el,ind)=>{
        if(el.value===qs.launch_year){
            el.checked="true"
        }
    })
    const qsr = Object.keys(qs).map(key => `${key}=${qs[key]}`).join('&');

    fetch(`https://api.spaceXdata.com/v3/launches?limit=100&${qsr}`)
    .then(res => res.json())
    .then(data => {
        data.length?data.forEach(element => {
            loadList.innerHTML+=`
            <div class="col-list">
            <div class="list-wrap">
                <div class="img-wrap">
                    <img src="${element.links.mission_patch_small}" alt="">
                </div>
                <h5 class="name">${element.mission_name} #${element.flight_number}</h5>
                <div class="text-small">Mission Ids <span> <ul>${element.mission_id.length?element.mission_id.map(id => `<li>${id}</li>`).join(''):"<li>null</li>"}</ul></span></div>
                <div class="text-small">Launch Year <span>${element.launch_year}</span></div>
                <div class="text-small">Successful Launch <span>${element.launch_success}</span></div>
                <div class="text-small">Successful Landing <span>${element.rocket.first_stage.cores[0].land_success}</span></div>
            </div>
        </div>
            `;
        }): loadList.innerHTML="<p>No answer for selected filter from API or API server may be down</p>";
        document.querySelector('.loading').style.display ="none";
    });
    function loadData(params1,params2,params3) {
        document.querySelector('.loading').style.display ="block";
        loadList.innerHTML =""
        window.history.replaceState(null, null, `?launch_success=${params1}&land_success=${params2}&launch_year=${params3}`);
        fetch(`https://api.spaceXdata.com/v3/launches?limit=100&launch_success=${params1}&land_success=${params2}&launch_year=${params3}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            data.length?data.forEach(element => {
                loadList.innerHTML+=`
                <div class="col-list">
                <div class="list-wrap">
                    <div class="img-wrap">
                        <img src="${element.links.mission_patch_small}" alt="">
                    </div>
                    <h5 class="name">${element.mission_name} #${element.flight_number}</h5>
                    <div class="text-small">Mission Ids <span> <ul>${element.mission_id.length?element.mission_id.map(id => `<li>${id}</li>`).join(''):"<li>null</li>"}</ul></span></div>
                    <div class="text-small">Launch Year <span>${element.launch_year}</span></div>
                    <div class="text-small">Successful Launch <span>${element.launch_success}</span></div>
                    <div class="text-small">Successful Landing <span>${element.rocket.first_stage.cores[0].land_success}</span></div>
                </div>
            </div>
                `;
            }): loadList.innerHTML="<p>No answer for selected filter from API or API server may be down</p>";
        });
        document.querySelector('.loading').style.display ="none";
    }
    dateFilter.forEach(elem=>{
        elem.onclick=function(e){
            //var aa =[].slice.call(launchFilter, 0).filter(el => el.checked);
            //console.log(aa)
            var data1 = ""
            launchFilter.forEach(el=>{
                if(el.checked)
                data1 =el.value;
            })
            
            var data2 = ""
            landFilter.forEach(el=>{
                if(el.checked)
                data2 =el.value;
            })
            var data3 = elem.value
            loadData(data1,data2,data3)
        }
    });
    launchFilter.forEach(elem=>{
        elem.onclick=function(e){
            var data1 = elem.value
            var data2 = ""
            landFilter.forEach(el=>{
                if(el.checked)
                data2 =el.value;
            })
            var data3 = ""
            dateFilter.forEach(el=>{
                if(el.checked)
                data3 =el.value;
            })
            loadData(data1,data2,data3)
        }
    })
    landFilter.forEach(elem=>{
        elem.onclick=function(e){
            var data1 = ""
            launchFilter.forEach(el=>{
                if(el.checked)
                data1 =el.value;
            })
            var data2 = elem.value
            var data3 = ""
            dateFilter.forEach(el=>{
                if(el.checked)
                data3 =el.value;
            })
            loadData(data1,data2,data3)
        }
    })


});
