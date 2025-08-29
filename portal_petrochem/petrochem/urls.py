from django.urls import path
from . import views


app_name = 'petrochem'

urlpatterns = [
    path('',views.index, name="index"),
    path('generate_new_table',views.generate_new_table, name="generate_new_table"),
    path('update_table',views.update_table, name="update_table"),
    # path('generate_geojson',views.generate_geojson, name="generate_geojson"),
    path('getcounties_view',views.getcounties_view, name="getcounties_view"),
    path('getstates_view',views.getstates_view, name="getstates_view"),
    path('createCountyList',views.createCountyList, name="createCountyList"),
    path('createStatusList',views.createStatusList, name="createStatusList"),
    path('createTypeList',views.createTypeList, name="createTypeList"),
    path('generate_geojson_buffs',views.generate_geojson_buffs, name="generate_geojson_buffs"),
    path('generate_geojson_comps',views.generate_geojson_comps, name="generate_geojson_comps"),
    path('generate_geojson_lines',views.generate_geojson_lines, name="generate_geojson_lines"),
    path('generate_geojson_buffs_alt',views.generate_geojson_buffs_alt, name="generate_geojson_buffs_alt"),
    path('generate_geojson_buffs2',views.generate_geojson_buffs2, name="generate_geojson_buffs2"),
    path('generate_photo_pts',views.generate_photo_pts, name="generate_photo_pts"),
]