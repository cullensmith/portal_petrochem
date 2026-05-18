from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.http import require_POST
from petrochem.models import Compressors, Buffs, PetrochemDownloadLog
from django.apps import apps
from django.db import connection
import json


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR')


@require_POST
def log_download(request):
    try:
        data = json.loads(request.body)
        name        = data.get('name', '').strip()
        email       = data.get('email', '').strip().lower()
        affiliation = data.get('affiliation', '').strip()
        file_name   = data.get('file_name', '').strip()
        searchcrit  = data.get('searchcrit', '').strip()

        if not name:
            return JsonResponse({'success': False, 'error': 'Name is required.'})
        if not email or '@' not in email:
            return JsonResponse({'success': False, 'error': 'Valid email is required.'})
        if not affiliation:
            return JsonResponse({'success': False, 'error': 'Affiliation is required.'})

        PetrochemDownloadLog.objects.create(
            name=name,
            email=email,
            affiliation=affiliation,
            file_name=file_name or None,
            ip_address=get_client_ip(request),
            searchcrit=searchcrit or None,
        )
        return JsonResponse({'success': True})

    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'error': 'Invalid request.'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})


# Create your views here.
def index(request):
    return HttpResponse("Welcome to our petrochem data inventory")





from django.shortcuts import render
from .models import Photos,Counties, States#, Wells, stStatus, stType #, CountyNames
from django.http import HttpResponse
from django.http import JsonResponse
# from django.views.generic import View
# from django.db.models import Q
import json 
import ast
import time

from django.core.serializers import serialize

# Create your views here.
def wells(request):
    wells = Wells.objects.all()
    return render(request, 'wells.html', { 'wells': wells })

def createCountyList(request):
    filtered = list()
    print(request.GET.getlist('states')) #[0].split(',')
    print('states_in request ^')
    states_in = request.GET.getlist('states')[0].split(',')
    states = [s.strip().replace('input-','') for s in states_in]
    print(f'states_county: {states}')
    cl = Counties.objects.filter(statename__in=states)  # Query all polygons
    for c in cl:
        item = dict()
        item['county'] = c.county
        item['statename'] = c.statename
        item['stusps'] = c.stusps
        filtered.append(item)
        
    return JsonResponse(json.dumps(sorted(filtered, key=lambda x: (x['stusps'], x['county']))), safe=False)

def createStatusList(request):
    filtered = list()
    states_in = request.GET.getlist('states')[0].split(',')
    states = [statenameMap(s.strip().replace('input-','')) for s in states_in if len(s) > 1]
    print(f'states_status: {states}')
    cl = stStatus.objects.filter(stusps__in=states)  # Query all polygons
    for c in cl:
        # print(f'c status= {c.well_status}')
        # print(f'c usps= {c.stusps}')
        item = dict()
        item['well_status'] = c.well_status
        item['stusps'] = c.stusps
        filtered.append(item)
        
    return JsonResponse(json.dumps(sorted(filtered, key=lambda x: (x['stusps'], x['well_status']))), safe=False)

def createTypeList(request):
    filtered = list()
    states_in = request.GET.getlist('states')[0].split(',')
    states = [statenameMap(s.strip().replace('input-','')) for s in states_in if len(s) > 1]
    print(f'states_type: {states}')
    cl = stType.objects.filter(stusps__in=states)  # Query all polygons
    for c in cl:
        item = dict()
        item['well_type'] = c.well_type
        item['stusps'] = c.stusps
        filtered.append(item)
        
    return JsonResponse(json.dumps(sorted(filtered, key=lambda x: (x['stusps'], x['well_type']))), safe=False)

def statenameMap(s):
    statedict = {
        "Alabama": "AL",
        # "Alaska": "AK",
        "Arizona": "AZ",
        "Arkansas": "AR",
        "California": "CA",
        "Colorado": "CO",
        # "Connecticut": "CT",
        # "Delaware": "DE",
        "Florida": "FL",
        # "Georgia": "GA",
        # "Hawaii": "HI",
        "Idaho": "ID",
        "Illinois": "IL",
        "Indiana": "IN",
        "Iowa": "IA",
        "Kansas": "KS",
        "Kentucky": "KY",
        "Louisiana": "LA",
        # "Maine": "ME",
        "Maryland": "MD",
        # "Massachusetts": "MA",
        "Michigan": "MI",
        # "Minnesota": "MN",
        "Mississippi": "MS",
        "Missouri": "MO",
        "Montana": "MT",
        "Nebraska": "NE",
        "Nevada": "NV",
        # "New Hampshire": "NH",
        # "New Jersey": "NJ",
        "New Mexico": "NM",
        "New York": "NY",
        # "North Carolina": "NC",
        "North Dakota": "ND",
        "Ohio": "OH",
        "Oklahoma": "OK",
        "Oregon": "OR",
        "Pennsylvania": "PA",
        # "Rhode Island": "RI",
        # "South Carolina": "SC",
        "South Dakota": "SD",
        "Tennessee": "TN",
        "Texas": "TX",
        "Utah": "UT",
        # "Vermont": "VT",
        "Virginia": "VA",
        "Washington": "WA",
        "West Virginia": "WV",
        "Wisconsin": "WI",
        "Wyoming": "WY"
    }

    return statedict[s]



def getstates_view(request):
    print('now were getting the states for the map')
    print(f'here is the request from getstates: {request}')
    print(f"states requested from getstates: {request.GET.getlist('states')}")
    states_in = request.GET.getlist('states')[0].split(',')
    print(f'states in = {states_in}')
    states = list()
    for s in states_in:
        h = s.strip()
        # states.append(h)
        # states.append(h.upper())
        # states.append(h.lower())
        states.append(h.title())
    print(f"states--{len(states)}->{states}")
    filter_kwargs = dict()
    # if len(states) == 1:
    #     filter_kwargs.update(f'statename__iexact={states}')
    # else:
    # for getstate in states:
        
    filter_kwargs.update({'statename__in':states})

    print(f'the query = {filter_kwargs}')
    polygons = States.objects.filter(**filter_kwargs)  # Query all polygons
    print(f'state polygons-_-_-_-->{polygons}')
    features = []
    for i,polygon in enumerate(polygons):
        # if i > 5:
        #     break
        # Parse GeoJSON text from the geomjson field
        geojson_data = polygon.geomjson
        # Add GeoJSON feature to the list
        feature = dict()
        feature['type'] = "Feature"
        feature['properties'] = {}
        feature['geometry'] = ast.literal_eval(geojson_data)
        features.append(feature)
        # print('so we got here')
        
    # Create GeoJSON FeatureCollection
    geojson_collection = {
        "type": "FeatureCollection",
        "features": features
    }
    # print(geojson_collection)
    return JsonResponse(geojson_collection)


def getcounties_view(request):
    print('now were getting the counties for the map')
    print(f'here is the request from getcounties: {request}')
    print(f"states requested from getcounties: {request.GET.getlist('states')}")
    print(request.GET.getlist('states')) #[0].split(',')
    print('states_in request ^^')
    states_in = request.GET.getlist('states')[0].split(',')
    print(f'states in = {states_in}')
    states = list()
    for s in states_in:
        h = s.strip()
        states.append(h.title())
    print(f"states--{len(states)}->{states}")
    filter_kwargs = dict()

    filter_kwargs.update({'statename__in':states})

    print(f'the query = {filter_kwargs}')
    polygons = Counties.objects.filter(**filter_kwargs)  # Query all polygons
    features = []
    for i,polygon in enumerate(polygons):
        geojson_data = polygon.geomjson
        feature = dict()
        feature['type'] = "Feature"
        feature['statename'] = polygon.stusps
        feature['county'] = polygon.county
        feature['geometry'] = ast.literal_eval(geojson_data)
        features.append(feature)
    geojson_collection = {
        "type": "FeatureCollection",
        "features": features
    }
    # print(geojson_collection)
    return JsonResponse(geojson_collection)

def update_table():
    # selected_dataset = request.GET.getlist('selectedDataset[]')
    # cols=list()
    print('==================================================\n=================================')
    cols = ["api_num",
            "other_id",
            "latitude",
            "longitude",
            "stusps",
            "county",
            "municipality",
            "well_name",
            "operator",
            "spud_date",
            "plug_date",
            "well_type",
            "well_status",
            "well_configuration",
            "ft_category"]
    new_table = generate_new_table(cols)
    return HttpResponse(new_table)

def generate_new_table(cols):
    # Simulate generating a new table
    cols = ["api_num",
            "other_id",
            "latitude",
            "longitude",
            "stusps",
            "county",
            "municipality",
            "well_name",
            "operator",
            "spud_date",
            "plug_date",
            "well_type",
            "well_status",
            "well_configuration",
            "ft_category"]
    new_table_html = "<tr>"
    # print(f'here are the columns{cols}')
    for i in cols:
        new_table_html += f"<th>{i}</th>"
    new_table_html += "</tr>"
    for i in range(1, 2):
        new_table_html += "<tr>"
        for j in range(1, len(cols)+1):
            if j in (1,len(cols)):
                continue
            new_table_html += f"<td>Row {i} Data {j}</td>"
        new_table_html += "</tr>"
    return new_table_html


def parse_states(data):
    states = list()
    state_abbreviations = {
        'Alabama': 'AL',
        # 'Alaska': 'AK',
        'Arizona': 'AZ',
        'Arkansas': 'AR',
        'California': 'CA',
        'Colorado': 'CO',
        # 'Connecticut': 'CT',
        # 'Delaware': 'DE',
        'Florida': 'FL',
        # 'Georgia': 'GA',
        # 'Hawaii': 'HI',
        'Idaho': 'ID',
        'Illinois': 'IL',
        'Indiana': 'IN',
        'Iowa': 'IA',
        'Kansas': 'KS',
        'Kentucky': 'KY',
        'Louisiana': 'LA',
        # 'Maine': 'ME',
        'Maryland': 'MD',
        # 'Massachusetts': 'MA',
        'Michigan': 'MI',
        # 'Minnesota': 'MN',
        'Mississippi': 'MS',
        'Missouri': 'MO',
        'Montana': 'MT',
        'Nebraska': 'NE',
        'Nevada': 'NV',
        # 'New Hampshire': 'NH',
        # 'New Jersey': 'NJ',
        'New Mexico': 'NM',
        'New York': 'NY',
        # 'North Carolina': 'NC',
        'North Dakota': 'ND',
        'Ohio': 'OH',
        'Oklahoma': 'OK',
        'Oregon': 'OR',
        'Pennsylvania': 'PA',
        # 'Rhode Island': 'RI',
        # 'South Carolina': 'SC',
        'South Dakota': 'SD',
        'Tennessee': 'TN',
        'Texas': 'TX',
        'Utah': 'UT',
        # 'Vermont': 'VT',
        'Virginia': 'VA',
        'Washington': 'WA',
        'West Virginia': 'WV',
        'Wisconsin': 'WI',
        'Wyoming': 'WY'
    }

    for s in data:
        if len(s) > 1:
            h = s.strip()
            states.append(state_abbreviations[h.title()])

    return list(set(states))

# def generate_geojson(request):
#     start_time = time.time()
#     print('now were getting the data for the map')
#     print(f'here is the request from generate_geojson: {request}')
#     print(f"states requested from generate_geojson: {request.GET.getlist('states')}")
#     states_in = request.GET.getlist('states')[0].split(',')
#     states = parse_states(states_in)
#     stop_time1 = time.time()
#     print(f'part 1 took: {start_time - stop_time1} sec')

#     well_status = list()
#     if len(request.GET.getlist('well_status'))>0:
#         well_status_in = request.GET.getlist('well_status')[0].split(',')
#         for s in well_status_in:
#             if s:
#                 h = s[4:].strip()
#                 well_status.append(h)
#     well_status = list(set(well_status))

#     well_type = list()
#     if len(request.GET.getlist('well_type'))>0:
#         well_type_in = request.GET.getlist('well_type')[0].split(',')
#         for s in well_type_in:
#             if s:
#                 h = s[4:].strip()
#                 well_type.append(h)
#     well_type = list(set(well_type))

#     category = request.GET.getlist('category')
#     fcats = list()
#     try:
#         catsplit = category[0].split(',')
#         print(f'here is catsplit -->{catsplit}')
#         if 'default' in catsplit or 'initial' in catsplit:
#             fcats.append('default')
#         elif catsplit == ['']:
#             fcats.append('default')
#         else:
#             for c in category[0].split(','):
#                 fcats.append(c)
#     except:
#         fcats.append('default')
#     # stateop = request.GET.getlist('statesop')
#     try:
#         county_in = request.GET.getlist('county')[0].split(',')
#         county = list()
#         for s in county_in:
#             if len(s) > 0:
#                 h = s.strip()
#                 h = s.replace('County','').replace('COUNTY','').replace('county','').strip()
#                 h = s[4:].strip()
#                 county.append(h.title())
#         county = list(set(county))
#     except:
#         county = list()
#     filterop_dict = {'states':['stusps','',states], 
#                      'well_status':['well_status','',well_status],
#                      'well_type':['well_type','',well_type],
#                     #  'well_name':['well_name','',well_name],
#                      'county':['county','',county],
#                      'category':['category','',fcats]
#                     }
    
#     filter_dict = { 
#                    'county':county, 
#                    'well_status':well_status, 
#                    'well_type':well_type, 
#                 #    'well_name':well_name, 
#                    }

#     filter_kwargs = dict()

#     print(f'here is the main dict: {filterop_dict}')

#     stop_time2 = time.time()
#     print(f'part 2 took: {stop_time2 - stop_time1} sec')

#     for k,v in filterop_dict.items():
#         for s in v:
#             if len(s) > 0:
#                 if k == 'states':
#                     aval = filterop_dict[k]
#                     filter_kwargs.update({f'{aval[0]}__in':aval[2]})
#                 elif k in filter_dict.keys():
#                     aval = filterop_dict[k]
#                     if len(aval[2]) > 0:
#                         filter_kwargs.update({f'{aval[0]}__in':aval[2]})
#                 elif k == 'category':
#                     here = filterop_dict[k][2]
#                     if here == ['default']:
#                         continue
#                     else:
#                         filter_kwargs.update({f'ft_category__in':here})

#     stop_time3 = time.time()
#     print(f'part 3 took: {stop_time3 - stop_time2} sec')
#     print(f'here is the kwargs ---->> {filter_kwargs}')
#     attrvals = list()
#     attrvals = Wells.objects.filter(**filter_kwargs)

#     stop_time4 = time.time()
#     print(f'part 4 took: {stop_time4 - stop_time3} sec')

#     newwell = list()
#     for n,x in enumerate(attrvals):
#         tmp=vars(x)
#         tmp.pop('_state')
#         newwell.append(tmp)
#     geojson = {
#         "type": "FeatureCollection",
#         "features": [
#         {
#             "type": "Feature",
#             "geometry" : {
#                 "type": "Point",
#                 "coordinates": [d["longitude"], d["latitude"]],
#                 },
#             "properties" : d,
#         } for d in newwell]
#     }
#     stop_time5a = time.time()
#     print(f'part 5a took: {stop_time5a - stop_time4} sec')
#     mapdata = json.dumps(geojson)

#     stop_time5 = time.time()
#     print(f'part 5 took: {stop_time5 - stop_time5a} sec')



#     # mapdata = serialize('json', attrvals, fields=('api_num','other_id','latitude','longitude','stusps','county','municipality','well_name','operator','spud_date','plug_data','well_type','well_status','well_configuration','ft_category','id'))

#     stop_time6 = time.time()
#     print(f'part 6 took: {stop_time6 - stop_time5} sec')

#     print(f'part total was took: {stop_time6 - start_time} sec')
#     return JsonResponse(mapdata, safe=False)



#####
#####
#####
def generate_geojson_buffs_alt(request):
    print('=============')
    print('=============')
    model_name = 'Buffs'
    print(model_name)
    print('=============')
    print('=============')
    # print('using the right one...')
    attrvals = list()

    # Dynamically get the model class from the installed apps
    lines = apps.get_model('petrochem', model_name) 
        
    attrvals = lines.objects.all()

    newwell = list()
    for n,x in enumerate(attrvals):
        # print(x)
        tmp=vars(x)
        tmp.pop('_state')
        newwell.append(tmp)
    print(newwell[0])
    print('---')
    for n, i in enumerate(newwell):
        print(i['geomjson'])
        break
    print('---')
    # print(newwell[0]['geomjson'])
    geojson = {
        "type": "FeatureCollection",
        "features": [
        {
            "type": "Feature",
            "geometry" : json.loads(d['geomjson']),
            "properties" : d,
        } for d in newwell]
    }
    mapdata = json.dumps(geojson)

    return JsonResponse(mapdata, safe=False)


ALLOWED_LINE_MODELS = {
    'Pipeline_Crudeoil',
    'Pipeline_Naturalgas',
    'Pipeline_hgl',
    'Pipeline_Petroleum',
}

ALLOWED_POINT_MODELS = {
    'Bordercrossing_Electric',
    'Bordercrossing_Liquids',
    'Bordercrossing_Naturalgas',
    'Markethubs_hgl',
    'Markethubs_Naturalgas',
    'Ports_Petroleum',
    'Reserve_Petroleum',
    'Storage_Naturalgas',
    'Terminal_Crudeoil',
    'Terminal_Lng',
    'Terminal_Petroleum',
    'Compressors',
    'Plants_Biodiesel',
    'Plants_Ethanol',
    'Plants_Ethylene_Cracker',
    'Powerplants_Batterystorage',
    'Plants_Coal',
    'Plants_Geothermal',
    'Plants_Hydroelectric',
    'Plants_Hydropumped',
    'Plants_Naturalgas',
    'Plants_Nuclear',
    'Plants_Petroleum',
    'Plants_Processing_Naturalgas',
    'Plants_Refinery_Petroleum',
    'Fertilizer_Plant',
}

def generate_geojson_lines(request):
    print('=============')
    print('=============')
    model_name = request.GET.get('grab')
    print(model_name)
    print('=============')
    print('=============')
    # print('using the right one...')
    attrvals = list()

    if model_name not in ALLOWED_LINE_MODELS:
        return JsonResponse({'error': 'Invalid model name'}, status=400)

    # Dynamically get the model class from the installed apps
    lines = apps.get_model('petrochem', model_name)
        
    attrvals = lines.objects.all()

    newwell = list()
    for n,x in enumerate(attrvals):
        # print(x)
        tmp=vars(x)
        tmp.pop('_state')
        newwell.append(tmp)
    print(newwell[0])
    print('---')
    for n, i in enumerate(newwell):
        print(i['geomjson'])
        break
    print('---')
    # print(newwell[0]['geomjson'])
    geojson = {
        "type": "FeatureCollection",
        "features": [
        {
            "type": "Feature",
            "geometry" : json.loads(d['geomjson']),
            "properties" : d,
        } for d in newwell]
    }
    mapdata = json.dumps(geojson)

    return JsonResponse(mapdata, safe=False)

def generate_geojson_comps(request):
    print('=============')
    print('=============')
    model_name = request.GET.get('grab')
    print(model_name)
    print('=============')
    print('=============')
    # print('using the right one...')
    attrvals = list()

    if model_name not in ALLOWED_POINT_MODELS:
        return JsonResponse({'error': 'Invalid model name'}, status=400)

    # Dynamically get the model class from the installed apps
    points = apps.get_model('petrochem', model_name)
        
    attrvals = points.objects.all()

    newwell = list()
    for n,x in enumerate(attrvals):
        # print(x)
        tmp=vars(x)
        tmp.pop('_state')
        newwell.append(tmp)
    try:
        geojson = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [d["x"], d["y"]],
                    },
                    "properties": d,
                } for d in newwell
            ]
        }
    except (KeyError, TypeError):
        geojson = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [d["longitude"], d["latitude"]],
                    },
                    "properties": d,
                } for d in newwell
            ]
        }
    mapdata = json.dumps(geojson)

    return JsonResponse(mapdata, safe=False)


def download_fractracker(request):
    fmt = request.GET.get('fmt', 'geojson')
    ids_param = request.GET.get('ids', '')

    id_filter = ''
    params = []
    if ids_param:
        ftid_list = [int(i) for i in ids_param.split(',') if i.strip().isdigit()]
        if ftid_list:
            id_filter = 'WHERE ftid = ANY(%s)'
            params = [ftid_list]

    geojson_sql = f"""
        SELECT ST_AsGeoJSON(geom_4326) AS geom_json,
               ftid, name, status, company, product, state, res, diameter, datasrce, srcelink
        FROM pipelines.fractracker
        {id_filter}
        ORDER BY name
    """
    wkt_sql = f"""
        SELECT ST_AsText(geom_4326) AS geom_wkt,
               ftid, name, status, company, product, state, res, diameter, datasrce, srcelink
        FROM pipelines.fractracker
        {id_filter}
        ORDER BY name
    """

    if fmt == 'geojson':
        with connection.cursor() as cursor:
            cursor.execute(geojson_sql, params)
            cols = [d[0] for d in cursor.description]
            rows = cursor.fetchall()
        features = []
        for row in rows:
            row_dict = dict(zip(cols, row))
            geom = json.loads(row_dict.pop('geom_json')) if row_dict.get('geom_json') else None
            features.append({'type': 'Feature', 'geometry': geom, 'properties': row_dict})
        fc = {'type': 'FeatureCollection', 'features': features}
        response = JsonResponse(fc)
        response['Content-Disposition'] = 'attachment; filename="fractracker_pipelines.geojson"'
        return response

    # GeoPackage or Shapefile — requires geopandas
    try:
        import geopandas as gpd
        from shapely import wkt as shapely_wkt
        import tempfile, os, zipfile
        from io import BytesIO
    except ImportError:
        return HttpResponse('geopandas is required for this format. Run: pip install geopandas', status=500)

    with connection.cursor() as cursor:
        cursor.execute(wkt_sql, params)
        cols = [d[0] for d in cursor.description]
        rows = cursor.fetchall()

    records = []
    geoms = []
    for row in rows:
        row_dict = dict(zip(cols, row))
        geom_wkt = row_dict.pop('geom_wkt')
        geoms.append(shapely_wkt.loads(geom_wkt) if geom_wkt else None)
        records.append(row_dict)

    gdf = gpd.GeoDataFrame(records, geometry=geoms, crs='EPSG:4326')

    if fmt == 'gpkg':
        buf = BytesIO()
        gdf.to_file(buf, driver='GPKG', layer='fractracker_pipelines')
        buf.seek(0)
        response = HttpResponse(buf.read(), content_type='application/geopackage+sqlite3')
        response['Content-Disposition'] = 'attachment; filename="fractracker_pipelines.gpkg"'
        return response

    if fmt == 'shp':
        with tempfile.TemporaryDirectory() as tmpdir:
            shp_path = os.path.join(tmpdir, 'fractracker_pipelines.shp')
            gdf.to_file(shp_path, driver='ESRI Shapefile')
            buf = BytesIO()
            with zipfile.ZipFile(buf, 'w', zipfile.ZIP_DEFLATED) as zf:
                for fname in os.listdir(tmpdir):
                    zf.write(os.path.join(tmpdir, fname), fname)
            buf.seek(0)
        response = HttpResponse(buf.read(), content_type='application/zip')
        response['Content-Disposition'] = 'attachment; filename="fractracker_pipelines.zip"'
        return response

    return HttpResponse('Unknown format', status=400)


def fractracker_table(request):
    sql = """
        SELECT ftid, name, status, company, product, state, res, diameter, datasrce, srcelink
        FROM pipelines.fractracker
        ORDER BY name
    """
    with connection.cursor() as cursor:
        cursor.execute(sql)
        cols = [c[0] for c in cursor.description]
        rows = cursor.fetchall()

    features = [
        {'type': 'Feature', 'geometry': None, 'properties': dict(zip(cols, row))}
        for row in rows
    ]
    return JsonResponse({'type': 'FeatureCollection', 'features': features})


def fractracker_feature(request, feature_id):
    sql = """
        SELECT ST_AsGeoJSON(geom_4326), name, status, company, product, res
        FROM pipelines.fractracker
        WHERE ftid = %s
    """
    with connection.cursor() as cursor:
        cursor.execute(sql, [feature_id])
        row = cursor.fetchone()

    if not row or not row[0]:
        return JsonResponse({'error': 'Not found'}, status=404)

    return JsonResponse({
        'type': 'Feature',
        'geometry': json.loads(row[0]),
        'properties': {
            'name': row[1], 'status': row[2], 'company': row[3],
            'product': row[4], 'res': row[5],
        }
    })


def fractracker_tiles(request, z, x, y):
    z, x, y = int(z), int(x), int(y)

    sql = """
        WITH bounds AS (
            SELECT ST_Transform(ST_TileEnvelope(%s, %s, %s), 4326) AS geom
        ),
        mvtgeom AS (
            SELECT
                ST_AsMVTGeom(
                    p.geom_4326,
                    bounds.geom,
                    4096, 64, true
                ) AS geom,
                p.ftid
            FROM pipelines.fractracker p, bounds
            WHERE p.geom_4326 && bounds.geom
        )
        SELECT ST_AsMVT(mvtgeom, 'fractracker', 4096, 'geom') FROM mvtgeom
        WHERE geom IS NOT NULL
    """

    with connection.cursor() as cursor:
        cursor.execute(sql, [z, x, y])
        row = cursor.fetchone()

    tile_data = bytes(row[0]) if row and row[0] else b''
    response = HttpResponse(tile_data, content_type='application/x-protobuf')
    response['Cache-Control'] = 'public, max-age=3600'
    return response


def generate_geojson_buffs(request):
    # print('using the right one...')
    attrvals = list()
    attrvals = Buffs.objects.all()

    newwell = list()
    for n,x in enumerate(attrvals):
        # print(x)
        tmp=vars(x)
        tmp.pop('_state')
        newwell.append(tmp)
    geojson = {
        "type": "FeatureCollection",
        "features": [
        {
            "type": "Feature",
            "geometry" : {
                "type": "Point",
                "coordinates": [d["longitude"], d["latitude"]],
                },
            "properties" : d,
        } for d in newwell]
    }
    mapdata = json.dumps(geojson)

    return JsonResponse(mapdata, safe=False)

def generate_geojson_buffs2(request):
    print('using the right one...')
    attrvals = list()
    attrvals = Buffs.objects.all()

    newwell = list()
    for n,x in enumerate(attrvals):
        # print(x)
        tmp=vars(x)
        tmp.pop('_state')
        newwell.append(tmp)
    geojson = {
        "type": "FeatureCollection",
        "features": [
        {
            "type": "Feature",
            "geometry" : {
                "type": "Point",
                "coordinates": [d["longitude"], d["latitude"]],
                },
            "properties" : d,
        } for d in newwell]
    }
    mapdata = json.dumps(geojson)
    # print(mapdata)
    print('did this run?????')
    return JsonResponse(mapdata, safe=False)

def generate_photo_pts(request):
    # print('getting the images...')
    attrvals = list()
    attrvals = Photos.objects.all()

    pt = list()
    for n,x in enumerate(attrvals):
        # print(x)
        tmp=vars(x)
        tmp.pop('_state')
        pt.append(tmp)
    geojson = {
        "type": "FeatureCollection",
        "features": [
        {
            "type": "Feature",
            "geometry" : {
                "type": "Point",
                "coordinates": [d["longitude"], d["latitude"]],
                },
            "properties" : d,
        } for d in pt]
    }
    photopt = json.dumps(geojson)
    # print(photopt)
    return JsonResponse(photopt, safe=False)


from django.http import HttpResponse
import urllib.request
import json

def check_ip(request):
    try:
        with urllib.request.urlopen('https://api.ipify.org?format=json') as response:
            data = json.loads(response.read().decode())
            ip = data['ip']
            return HttpResponse(f"Public IP: {ip}")
    except Exception as e:
        return HttpResponse(f"Error: {str(e)}")