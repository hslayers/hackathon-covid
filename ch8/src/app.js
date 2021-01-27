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
import { Style, Icon } from 'ol/style';
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
			title: 'Grain storages',
			source: new VectorSource({
				format: new GeoJSON(),
				url: 'https://db.atlasbestpractices.com/project-geo-json/5/',
			}),
			style: new Style({
				image: new Icon(({
					crossOrigin: 'anonymous',
					src: require('./img/afr_agri_icon.png').default,
					anchor: [0.5, 0.5],
					// scale: 0.25,
				}))
			}),
			selectedStyle: new Style({
				image: new Icon(({
					crossOrigin: 'anonymous',
					src: require('img/afr_agri_icon_active.png').default,
					anchor: [0.5, 0.5],
					// scale: 0.25,
				}))
			}),
			highlightedStyle: new Style({
				image: new Icon(({
					crossOrigin: 'anonymous',
					src: require('img/afr_agri_icon_active.png').default,
					anchor: [0.5, 0.5],
					// scale: 0.25,
				}))
			}),
			featureURI: 'bp_uri',
			ordering: {
				primary: 'position',
				secondary: 'bp_id',
				defaultReverse: ['position', 'bp_id'],
			},
			hsFilters: [
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
			]
		})
	],
	//project_name: 'hslayers',
	project_name: 'Material',
	default_view: new View({
		center: transform([22, 35], 'EPSG:4326', 'EPSG:3857'), //Latitude longitude	to Spherical Mercator
		zoom: 3,
		units: 'm',
		maxZoom: 9,
		minZoom: 2,
		constrainResolution: true,
	}),
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
