(function() {
	// API base URL
	const baseURL = 'https://nettiethuis-in.azurewebsites.net/Api/';

	//Get LocalStorage
	function getLocalStorage(key) {
		var value = localStorage.getItem(key);
		return null === value ? '' : value;
	}

	//setValue LocalStorage
	function setLocalStorage(key, value) {
		localStorage.setItem(key, null === value ? '' : value);
	}

	//initialize pre loader
	function setPreloaderState(state) {
		const preloader = document.querySelector('.preloader');
		if (state) {
			preloader.classList.add('active');
		} else {
			preloader.classList.remove('active');
		}
	}

	// Device List

	let deviceList;

	// Document Event listener
	document.addEventListener('click', event => {
		// const className =
		// 	event.target.classList[event.target.classList.length - 1];

		if (event.target.classList.contains('fa-cog')) {
			breadCrumb.setupPage();
		} else if (event.target.classList.contains('back-to-step-one')) {
			render.homePage();
		} else if (event.target.classList.contains('back-to-home')) {
			render.homePage();
		} else if (event.target.classList.contains('client-id-btn')) {
			setValue.clientIDToLocalStorage();
		} else if (event.target.classList.contains('select-device-btn-icon')) {
			setValue.selectDeviceFromList();
		} else if (event.target.classList.contains('token-setValue-btn')) {
			setValue.deviceToken(event);
		} else if (event.target.classList.contains('back-to-step-two')) {
			breadCrumb.backToStepTwoFromThree();
		} else if (event.target.classList.contains('form-btn')) {
			setValue.promizHeader();
		} else if (event.target.classList.contains('reset-session-id')) {
			render.homePage();
		} else if (event.target.classList.contains('fa-pencil')) {
			editDevice(event);
		} else if (event.target.classList.contains('fa-times')) {
			deleteDevice(event);
		} else if (event.target.classList.contains('token-update-btn')) {
			updateDeviceToken(event);
		}
	});

	// Delete Device func
	function deleteDevice(event) {
		const deviceID = event.target.parentNode.parentNode.dataset.deviceid;
		axios
			.get(baseURL + 'DelDevice', {
				params: {
					userid: getLocalStorage('clientID'),
					deviceID: deviceID
				}
			})
			.then(function(response) {
				// console.log(response);
				// let option = document.createElement('option');
				// option.innerHTML = event.target.parentNode.parentNode.innerText;
				// document.querySelector('.custom-select').appendChild(option);
				// deviceList.push(event.target.parentNode.parentNode.innerText);
				renderDeviceList();
			})
			.catch(function(error) {
				alert(error);
			});
	}

	//  Edit single device
	function editDevice(event) {
		const singleDevice = event.target.parentNode.parentNode;
		setLocalStorage('deviceType', singleDevice.textContent.trim());
		const deviceToken = singleDevice.dataset.devicetoken;
		setLocalStorage('deviceID', singleDevice.dataset.deviceid);

		document.querySelector('.header-area').innerHTML = templates.header(
			'Setup',
			'long-arrow-left back-to-step-two',
			'go-back-btn'
		);
		document.querySelector('.main-content').innerHTML = renderDeviceToken(
			deviceToken
		);
		document.querySelector('.footer-area').style.display = 'none';

		document.querySelector('.device-token').value = deviceToken;
		document
			.querySelector('.token-setValue-btn')
			.classList.add('token-update-btn');
		document
			.querySelector('.token-update-btn')
			.classList.remove('token-setValue-btn');
	}

	// updateDeviceToken
	function updateDeviceToken(event) {
		deleteDeviceOUpdate();
		document
			.querySelector('.token-update-btn')
			.classList.add('token-setValue-btn');
		document
			.querySelector('.token-setValue-btn')
			.classList.remove('token-update-btn');

		const deviceToken = document.querySelector('.device-token');
		const deviceTokenVal = deviceToken.value;

		if (deviceTokenVal !== '') {
			const deviceType = getLocalStorage('deviceType');
			const clientID = getLocalStorage('clientID');
			setPreloaderState(true);
			axios
				.get(baseURL + 'AddDevice', {
					params: {
						userid: clientID,
						deviceType: deviceType,
						Token: deviceTokenVal
					}
				})
				.then(function(response) {
					document.querySelector(
						'.header-area'
					).innerHTML = templates.header(
						'Setup',
						'long-arrow-left back-to-step-one',
						'go-back-btn'
					);
					document.querySelector(
						'.main-content'
					).innerHTML = renderDeviceListAndSelect();
					document.querySelector('.footer-area').style.display =
						'none';
					const clientID = document.querySelector('.client-id');
					clientID.value = getLocalStorage('clientID');
					setPreloaderState(false);
				})
				.catch(function(error) {
					alert(error);
				});
		} else {
			deviceToken.classList.add('empty-input');
		}
	}

	// deleteDeviceOUpdate for temporary
	function deleteDeviceOUpdate() {
		const deviceID = getLocalStorage('deviceID');
		axios
			.get(baseURL + 'DelDevice', {
				params: {
					userid: getLocalStorage('clientID'),
					deviceID: deviceID
				}
			})
			.then(function(response) {
				// console.log(response);
			})
			.catch(function(error) {
				alert(error);
			});
	}

	// Set Device token
	function setDeviceToken() {
		const deviceToken = document.querySelector('.device-token');
		const deviceTokenVal = deviceToken.value;

		if (deviceTokenVal !== '') {
			const deviceType = getLocalStorage('deviceType');
			const clientID = getLocalStorage('clientID');
			setPreloaderState(true);
			axios
				.get(baseURL + 'AddDevice', {
					params: {
						userid: clientID,
						deviceType: deviceType,
						Token: deviceTokenVal
					}
				})
				.then(function(response) {
					// const index = deviceList.indexOf(deviceType);
					// console.log('Index of : ', index);

					// deviceList.splice(index, 1);

					document.querySelector(
						'.header-area'
					).innerHTML = templates.header(
						'Setup',
						'long-arrow-left back-to-step-one',
						'go-back-btn'
					);
					document.querySelector(
						'.main-content'
					).innerHTML = renderDeviceListAndSelect();
					document.querySelector('.footer-area').style.display =
						'none';
					const clientID = document.querySelector('.client-id');
					clientID.value = getLocalStorage('clientID');
					setPreloaderState(false);
				})
				.catch(function(error) {
					alert(error);
				});
		} else {
			deviceToken.classList.add('empty-input');
		}
	}

	// navigation or Breadcrumb object
	const breadCrumb = {
		backToStepTwoFromThree: backToStepTwoFromThree,
		setupPage: setupPage
	};

	// Go to setup page
	function setupPage() {
		setPreloaderState(true);
		document.querySelector('.header-area').innerHTML = templates.header(
			'Setup',
			'long-arrow-left back-to-step-one',
			'go-back-btn'
		);
		document.querySelector(
			'.main-content'
		).innerHTML = renderDeviceListAndSelect();
		document.querySelector('.footer-area').style.display = 'none';
		const clientID = document.querySelector('.client-id');
		clientID.value = getLocalStorage('clientID');
	}

	// Back to step Two from three
	function backToStepTwoFromThree() {
		document.querySelector('.header-area').innerHTML = templates.header(
			'Setup',
			'long-arrow-left back-to-step-one',
			'go-back-btn'
		);
		document.querySelector(
			'.main-content'
		).innerHTML = renderDeviceListAndSelect();
		document.querySelector('.footer-area').style.display = 'none';
		const clientID = document.querySelector('.client-id');
		clientID.value = getLocalStorage('clientID');
	}

	// setValue Object
	const setValue = {
		clientIDToLocalStorage: setClientIDToLocalStorage,
		selectDeviceFromList: selectDeviceFromList,
		deviceToken: setDeviceToken,
		promizHeader: setpromizHeader
	};

	// set Promis Header Content
	function setpromizHeader() {
		if (localStorage.getItem('clientID') !== null) {
			document.querySelector('.header-area').innerHTML = templates.header(
				'Promis',
				'long-arrow-left reset-session-id',
				'go-back-btn'
			);
		}
	}

	// set clientID to LocalStorage
	function setClientIDToLocalStorage() {
		const clientID = document.querySelector('.client-id');
		if (clientID.value !== '') {
			clientID.classList.remove('empty-input');
			setLocalStorage('clientID', clientID.value);
			let cID = getLocalStorage('clientID');
			clientID.value = cID;
			document.querySelector('#clientID').value = cID;
			// console.log(getLocalStorage("clientID"));
		} else {
			clientID.classList.add('empty-input');
		}
	}

	// Select Device from list
	function selectDeviceFromList() {
		const selectedDevice = document.querySelector('.selected-device');
		const clientID = document.querySelector('.client-id');
		setLocalStorage('deviceType', selectedDevice.value);
		if (clientID.value !== '') {
			document.querySelector('.header-area').innerHTML = templates.header(
				'Setup',
				'long-arrow-left back-to-step-two',
				'go-back-btn'
			);
			document.querySelector(
				'.main-content'
			).innerHTML = renderDeviceToken();
			document.querySelector('.footer-area').style.display = 'none';
		} else {
			clientID.classList.add('empty-input');
		}
	}

	// Template object
	const templates = {
		header: headerTemplate,
		footer: footerTemplate,
		welcomeMessage: welcomeMsgTemplate
	};

	// Header Template
	function headerTemplate(title, iconOne, btnClass) {
		return `
		 <h2 class="title">${title}</h2>
		 <button class="btn ${btnClass}" type="button">
			<i class="fa fa-${iconOne}"></i>
		</button>
		`;
	}

	// Footer Template
	function footerTemplate(icon) {
		return `
		<button class="form-btn">Form
			<i class="fa fa-${icon}"></i>
		</button>
	`;
	}

	// Welcome message Template
	function welcomeMsgTemplate() {
		return `
		<div class="welcome-msg-area">
			<div class="single-msg d-flex">
				<img class="align-self-end" src="img/logo.svg" alt="" />
				<p class="">Goedendag</p>
			</div>
		</div>
	`;
	}

	// Render object
	const render = {
		deviceListAndSelectItem: renderDeviceListAndSelect,
		homePage: renderHomePage,
		deviceToken: renderDeviceToken
	};

	// Render Device List And Select Device select box
	function renderDeviceListAndSelect() {
		return `
		
			<div class="form-row">
				<div class="form-group col-10">
					<input
						type="text"
						class="form-control client-id"
						placeholder="Client id"
					/>
				</div>
				<div class="form-group col-2">
					<button type="button" class="btn ok-btn">
						<i class="fa fa-check-circle client-id-btn"></i>
					</button>
				</div>
			</div>
			<br>
		</div>
			<div class="my-devices">
			<h3 class="header-border-bottom">Mijn Thuismeters</h3>
			<div class="device-list">${renderDeviceList()}</div>
		</div><br>
		<div class="select-devices">
			
		</div>
	`;
	}

	// Render Device List
	function renderDeviceList() {
		let clientID = getLocalStorage('clientID');
		setPreloaderState(true);
		if (clientID === '') {
			clientID = null;
		}
		axios
			.get(baseURL + 'MyDevices?userid=' + clientID)
			.then(function(response) {
				let renderHTML = '<ul>';
				response.data.forEach(element => {
					renderHTML += `<li data-deviceID=${
						element.deviceID
					} class="single-device" data-deviceToken=${element.token}>${
						element.deviceType
					} <button type="button" class="btn delete-device-btn">
					<i class="fa fa-times"></i>
                    </button> 
                    <button type="button" class="btn edit-device-btn">
					<i class="fa fa-pencil"></i>
                    </button> 
                    
                    </li>`;
				});
				renderHTML += '</ul>';

				let tempDeviceList = ['Apple', 'Vivago'];
				function compare(arr1, arr2) {
					if (arr2.length <= 0) {
						return arr1;
					}

					for (let i = 0; i < arr1.length; i++) {
						for (let j = 0; j < arr2.length; j++) {
							if (arr1[i] === arr2[j].deviceType) {
								let index = tempDeviceList.indexOf(arr1[i]);

								tempDeviceList.splice(index, 1);
								--i;
							}
						}
					}

					return tempDeviceList;
				}

				deviceList = compare(tempDeviceList, response.data);
				document.querySelector(
					'.select-devices'
				).innerHTML = renderSelectDevice();
				$('.device-list').html(renderHTML);

				setPreloaderState(false);
			})
			.catch(function(error) {
				alert(error);
			});
	}

	function renderSelectDevice() {
		return `
        <h3 class="header-border-bottom">Thuismeter toevoegen:</h3>
            <select class="custom-select selected-device custom-select-md">
				${deviceList.map(el => `<option>${el} </option>`).join('')}
			</select>
			<button type="button" class="btn select-device-btn">
				<i class="fa fa-plus select-device-btn-icon"></i>
			</button>`;
	}

	// Render Home step
	function renderHomePage() {
		document.querySelector('.header-area').innerHTML = templates.header(
			'Nettie Thuis',
			'cog',
			'setting-btn'
		);
		document.querySelector(
			'.main-content'
		).innerHTML = templates.welcomeMessage();
		document.querySelector('.footer-area').innerHTML = templates.footer(
			'list-alt'
		);
		document.querySelector('.footer-area').style.display = 'block';
	}

	// Render Device Token
	function renderDeviceToken(tokenValue = '') {
		const deviceType = getLocalStorage('deviceType');

		if (deviceType === 'Vivago') {
			return `

            <div class="form-row mt-4">
            <div class="form-group col-12 text-center"> 
             <img class="vivago" src="img/vivago.png" alt=""></div>
			<div class="form-group col-10">
                <input
					type="text"
					class="form-control device-token"
                    placeholder="Device number"
                    value="${tokenValue}"
                />
			</div>
			<div class="form-group col-1">
				<button type="button" class="btn ok-btn">
					<i class="fa fa-check-circle token-setValue-btn"></i>
				</button>
            </div>
		</div>
	`;
		} else {
			return `
		<div class="form-row mt-4">
			<div class="form-group col-10">
                <input
					type="text"
					class="form-control device-token"
                    placeholder="Token"
                     value="${tokenValue}"
                />
			</div>
			<div class="form-group col-1">
				<button type="button" class="btn ok-btn">
					<i class="fa fa-check-circle token-setValue-btn"></i>
				</button>
            </div>
		</div>
	`;
		}
	}

	window.onload = function() {
		document.querySelector('#clientID').value = getLocalStorage('clientID');
	};
})();
