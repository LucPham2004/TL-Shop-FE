function redirectToProfilePageWithJWT() {
    const jwtToken = localStorage.getItem('token');

    fetch('/user/profile', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + "eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJzZWxmIiwic3ViIjoicmlkb0BnbWFpbC5jb20iLCJpYXQiOjE3MjI2NTU5NTksInJvbGVzIjoiVVNFUiJ9.pzpr4xWaY8baO1m8LKyyVOk-3Mkgj35DBM_hXDZYCTw3MpqJ6zPE2K2SOpg-pdofcMmtFyYWkKcR0_pCOJw9-zmYf_OCp_mCQM_asB_YvrGkgmo-9918Fe2lhS9EeCNZHr3cYzsBSEPc9HoHbOZQ2XVMO8ovXwLBJD3CXq4su2uDdmalHLlDaBlbiPggwZrojjOH4D6EkQzV6D1Mp6Lr4OQ7gboZofXbLHPRUFmLkU2lNQVTvi8I1Wk3guKnqjI52aI7PEDevujT3_Z5pQLbACK1YFTV-hmN2m1TcukFKhqE2a6LkEtqe_VdPu8r_nBe3s7In81K3cK6pa6qjJWf3g"
        }
	})
	.then(response => {
		if (response.ok) {
			return response.text();
		}
		throw new Error('Network response was not ok.');
	})
	.then(data => {
		document.body.innerHTML = data;
	})
	.catch(error => {
		console.error('There was a problem with the fetch operation:', error);
	});
}
