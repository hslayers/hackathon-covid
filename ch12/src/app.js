import 'toolbar.module';
import 'core.module';
import 'feature-filter.module';
import 'layermanager.module';
import 'map.module';
import 'permalink.module';
import 'query.module';
import 'gallery.module';
import 'angular-material';
import { Vector, Tile } from 'ol/layer';
import { XYZ, Vector as VectorSource } from 'ol/source';
import { GeoJSON } from 'ol/format';
import { Style, Icon, Text, Fill, Stroke } from 'ol/style';
import { transform } from 'ol/proj';
import View from 'ol/View';
import {unByKey} from 'ol/Observable';

import Attribution from 'ol/control/Attribution';

import 'angular-material/angular-material.css';
import 'ol/ol.css';
import 'css/app.css';
import 'css/whhg-font/css/whhg.css';
import './app.css';

const module = angular.module('hs', [
	'hs.toolbar',
	'hs.layermanager',
	'hs.map',
	'hs.query',
	'hs.gallery',
	'hs.permalink',
	'hs.core',
	'hs.featureFilter',
	'ngMaterial'
])

	.config(function($mdThemingProvider) {
		$mdThemingProvider.theme('default')
			.primaryPalette('brown', {
				'default': '700',
				'hue-1': '400'
			})
			.accentPalette('brown');
	});

module.directive('hs', function(HsMapService, HsCore) {
	'ngInject';
	return {
		template: HsCore.hslayersNgTemplate,
		link: function(scope, element) {
			HsCore.fullScreenMap(element);
		}
	};
});

const caturl = '/php/metadata/csw/index.php';

function styleFunction(feature) {
	const atr = feature.get('no_job_positions');
	return new Style({
		image: new Icon({
			src: atr > 0
				? require('./img/job_icon_orange_02_active.png').default
				: require('./img/job_icon_gray_02_active.png').default,
			anchor: [0.5, 1],
			scale: 0.25,
		})
	});
}

function highlightedStyleFunction(feature) {
	const atr = feature.get('no_job_positions');
	return new Style({
		image: new Icon({
			src: atr > 0
				? require('./img/job_icon_orange_02.png').default
				: require('./img/job_icon_gray_02.png').default,
			anchor: [0.5, 1],
			scale: 0.25,
		})
	});
}

module.value('HsConfig', {
	proxyPrefix: '/proxy/',
	// appLogo: require('./img/enabling_logo.png').default,
	design: 'md',
	importCss: false,
	permalinkParameters: {
	  center: false,
	  featureURI: true,
		hs_panel: false,
		language: false,
		layers: false
	},
	query: {
		multi: false
	},
	queryPoint: 'hidden',
	sidebarToggleable: false,
	panelWidths: {
		default: '60%',
	},
	popupOffset: [0, -27],
	mapControls: [
		new Attribution(),
	],
	componentsEnabled: {
		'geolocationButton': false,
	},
	directiveTemplates: {
		'md-sidenav': require('sidenav.html'),
		layout: require('layoutmd.html'),
		'md-overlay': require('overlay.html'),
		'md-toolbar': require('toolbar.html'),
		'feature-list': require('feature-list-md.html'),
		'query-info-panel-md': require('infopanel-md.html'),
		// help: require('help.html'),
		// policies: require('policies.html'),
		// acknowledgement: require('acknowledgement.html')
	},
	default_layers: [
		new Tile({
			source: new XYZ({
				attributions: ['Maps <a href="http://www.thunderforest.com">Thunderforest</a>', 'Data <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'],
				url: 'https://tile.thunderforest.com/atlas/{z}/{x}/{y}.png?apikey=820bd076452548f894e0059944475cb9',
			}),
			title: 'Base layer',
			base: true,
			visible: true,
		}),
		new Vector({
			title: 'Job Opportunities',
			source: new VectorSource({
				format: new GeoJSON(),
				url: 'https://db.atlasbestpractices.com/project-geo-json/6/',
			}),
			style: styleFunction,
			selectedStyle: highlightedStyleFunction,
			highlightedStyle: highlightedStyleFunction,
			featureURI: 'bp_uri',
			ordering: {
				primary: 'position',
				secondary: 'bp_id',
				defaultReverse: ['position', 'bp_id'],
			},
			hsFilters: [
				{
					title: 'Disability type',
					valueField: 'tags',
					type: {
						type: 'arrayset',
						parameters: 'or',
					},
					selected: undefined,
					values: [],
					gatherValues: true
				},
				{
					title: 'Country',
					valueField: 'SU_A3',
					type: {
						type: 'fieldset',
					},
					selected: undefined,
					values: [],
					gatherValues: true
				},
				{
					title: 'Open positions',
					valueField: 'no_job_positions',
					type: {
						type: 'compare',
						parameters: 'neq',
					},
					value: 0,
				},
			]
		})
	],
	//project_name: 'hslayers',
	project_name: 'Material',
	default_view: new View({
		center: transform([8.3927408, 46.9205358], 'EPSG:4326', 'EPSG:3857'), //Latitude longitude	to Spherical Mercator
		zoom: 4,
		units: 'm',
		maxZoom: 11,
		minZoom: 2,
		constrainResolution: true,
	}),
	hostname: {
		'default': {
			'title': 'Default',
			'type': 'default',
			'editable': false,
			'url': 'http://atlas.kraj-lbc.cz'
		}, /*,
		'compositions_catalogue': {
			'title': 'Compositions catalogue',
			'type': 'compositions_catalogue',
			'editable': true,
			'url': 'http://foodie-dev.wirelessinfo.cz'
		},*/
		'status_manager': {
			'title': 'Status manager',
			'type': 'status_manager',
			'editable': true,
			'url': 'http://foodie-dev.wirelessinfo.cz'
		}
	},
	social_hashtag: 'via @opentnet',
	//compositions_catalogue_url: '/p4b-dev/cat/catalogue/libs/cswclient/cswClientRun.php',
	//compositions_catalogue_url: 'http://erra.ccss.cz/php/metadata/csw/index.php',
	//status_manager_url: '/wwwlibs/statusmanager2/index.php',

	'catalogue_url': caturl || '/php/metadata/csw/',
	'compositions_catalogue_url': caturl || '/php/metadata/csw/',
	status_manager_url: '/wwwlibs/statusmanager/index.php'
});

module.controller('Main', ['$scope', '$rootScope', 'HsCore', 'HsQueryBaseService', 'HsQueryVectorService', 'HsCompositionsParserService', 'HsFeatureFilterService', 'HsLayermanagerService', '$mdBottomSheet',
	function($scope, $rootScope, HsCore, BaseService, VectorService, composition_parser, HsFeatureFilter, LayMan, $mdBottomSheet) {
		$scope.HsCore = HsCore;
		$rootScope.$on('layermanager.layer_added', function (e, layer) {
			if (layer.hsFilters || layer.ordering) LayMan.currentLayer = layer;
			BaseService.activateQueries();
		});
	},
]);
