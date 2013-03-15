// 		JDCT    Epoch Julian Date, Coordinate Time
//       EC     Eccentricity, e                                                   
//       QR     Periapsis distance, q (AU)                                        
//       IN     Inclination w.r.t xy-plane, i (degrees)                           
//       OM     Longitude of Ascending Node, OMEGA, (degrees)                     
//       W      Argument of Perifocus, w (degrees)                                
//       Tp     Time of periapsis (Julian day number)                             
//       N      Mean motion, n (degrees/day)                                      
//       MA     Mean anomaly, M (degrees)                                         
//       TA     True anomaly, nu (degrees)                                        
//       A      Semi-major axis, a (AU)                                           
//       AD     Apoapsis distance (AU)                                            
//       PR     Sidereal orbit period (day) 

var ephemeris = [
	{
		name: 'Sun',
		texture: './images/solarsystem/sunmap.jpg',
		size: 1392684
	},{
		name: 'Mercury',
		texture: './images/solarsystem/mercurymap.jpg',
		size: 2439.7,
		period: 87.96926,
		e: [ 0.20563593, 0.00002123 ],
		a: [ 0.38709843, 0.00000000 ],
		I: [ 7.00559432, -0.00590158 ],
		L: [ 252.25166724, 149472.67486623 ],
		wBar: [ 77.45771895, 0.15940013 ],
		om: [ 48.33961819, -0.12214182 ],
		aphelion: 69817445
	},{
		name: 'Venus',
		texture: './images/solarsystem/venusmap.jpg',
		size: 6051.8,
		period: 224.7008,
		e: [ 0.72332102, -0.00000026 ],
		a: [ 0.00676399, -0.00005107 ],
		I: [ 3.39777545, 0.00043494 ],
		L: [ 181.97970850, 58517.81560260 ],
		wBar: [ 131.76755713, 0.05679648 ],
		om: [ 76.67261496,-0.27274174 ],
		aphelion: 108942780
	},{
		name: 'Earth',
		texture: './images/solarsystem/earthmap2.jpg',
		size: 6371.00,
		period: 365.25636,               
		e: [ 1.00000018, -0.00000003 ],
		a: [ 0.01673163, -0.00003661 ],
		I: [ -0.00054346, -0.01337178 ],
		L: [ 100.46691572, 35999.37306329 ],
		wBar: [ 102.93005885, 0.31795260 ],
		om: [ -5.11260389, -0.24123856 ],
		aphelion: 152098233
	},{
		name: 'Mars',
		texture: './images/solarsystem/marsmap.jpg',
		size: 3389.5,
		period: 686.97959,
		e: [ 1.52371243, 0.00000097 ],
		a: [ 0.09336511, 0.00009149 ],
		I: [ 1.85181869, -0.00724757  ],
		L: [ -4.56813164, 19140.29934243 ],
		wBar: [ -23.91744784, 0.45223625 ],
		om: [ 49.71320984, -0.26852431 ],
		aphelion: 249232432
	},{
		name: 'Jupiter',
		texture: './images/solarsystem/jupitermap.jpg',
		size: 69911,
		period: 4332.8201,
		e: [ 5.20248019, -0.00002864 ],
		a: [ 0.04853590,  0.00018026 ],
		I: [ 1.29861416, -0.00322699  ],
		L: [ -34.33479152,  3034.90371757 ],
		wBar: [ 14.27495244, 0.18199196 ],
		om: [ 100.29282654, 0.13024619 ],
		aphelion: 816001807
	},{
		name: 'Saturn',
		texture: './images/solarsystem/saturnmap.jpg',
		size: 58232,
		period: 10755.699,             
		e: [ 9.54149883, -0.00003065 ],
		a: [ 0.05550825, -0.00032044 ],
		I: [ 2.49424102, 0.00451969  ],
		L: [ 50.07571329, 1222.11494724 ],
		wBar: [ 92.86136063, 0.54179478 ],
		om: [ 113.63998702, -0.25015002 ],
		aphelion: 1503509229
	},{
		name: 'Uranus',
		texture: './images/solarsystem/uranusmap.jpg',
		size: 30687.153,
		period: 30700,                  
		e: [ 19.18797948, -0.00020455 ],
		a: [ 0.04685740, -0.00001550 ],
		I: [ 0.77298127, -0.00180155  ],
		L: [ 314.20276625, 428.49512595 ],
		wBar: [ 172.43404441, 0.09266985 ],
		om: [ 73.96250215, 0.05739699 ],
		aphelion: 3006318143
	},{
		name: 'Neptune',
		texture: './images/solarsystem/neptunemap.jpg',
		size: 24622,
		period: 60190.03,
		e: [ 30.06952752, 0.00006447 ],
		a: [ 0.00895439, 0.00000818 ],
		I: [ 1.77005520, 0.00022400  ],
		L: [ 304.22289287, 218.46515314 ],
		wBar: [ 46.68158724, 0.01009938 ],
		om: [ 131.78635853, -0.00606302  ],
		aphelion: 4537039826
	}	
]