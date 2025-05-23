# Generated by Django 4.2.13 on 2025-05-21 14:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('petrochem', '0005_plants_coal_delete_powerplants_coal'),
    ]

    operations = [
        migrations.CreateModel(
            name='Plants_Geothermal',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('objectid', models.IntegerField()),
                ('plant_code', models.IntegerField()),
                ('plant_name', models.CharField(blank=True, max_length=50, null=True)),
                ('utility_id', models.IntegerField()),
                ('utility_name', models.CharField(blank=True, max_length=50, null=True)),
                ('sector_name', models.CharField(blank=True, max_length=50, null=True)),
                ('street_address', models.CharField(blank=True, max_length=50, null=True)),
                ('city', models.CharField(blank=True, max_length=50, null=True)),
                ('county', models.CharField(blank=True, max_length=50, null=True)),
                ('state', models.CharField(blank=True, max_length=50, null=True)),
                ('zip', models.IntegerField()),
                ('primsource', models.CharField(blank=True, max_length=50, null=True)),
                ('source_desc', models.CharField(blank=True, max_length=50, null=True)),
                ('tech_desc', models.CharField(blank=True, max_length=50, null=True)),
                ('install_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('total_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('bat_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('bio_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('coal_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('geo_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('hydro_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('hydrops_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('ng_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('nuclear_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('crude_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('solar_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('wind_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('other_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('source', models.CharField(blank=True, max_length=50, null=True)),
                ('period', models.CharField(blank=True, max_length=50, null=True)),
                ('longitude', models.CharField(blank=True, max_length=50, null=True)),
                ('latitude', models.CharField(blank=True, max_length=50, null=True)),
            ],
            options={
                'db_table': '"eia"."powerplants_geothermal"',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Plants_Hydroelectric',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('objectid', models.IntegerField()),
                ('plant_code', models.IntegerField()),
                ('plant_name', models.CharField(blank=True, max_length=50, null=True)),
                ('utility_id', models.IntegerField()),
                ('utility_name', models.CharField(blank=True, max_length=50, null=True)),
                ('sector_name', models.CharField(blank=True, max_length=50, null=True)),
                ('street_address', models.CharField(blank=True, max_length=50, null=True)),
                ('city', models.CharField(blank=True, max_length=50, null=True)),
                ('county', models.CharField(blank=True, max_length=50, null=True)),
                ('state', models.CharField(blank=True, max_length=50, null=True)),
                ('zip', models.IntegerField()),
                ('primsource', models.CharField(blank=True, max_length=50, null=True)),
                ('source_desc', models.CharField(blank=True, max_length=50, null=True)),
                ('tech_desc', models.CharField(blank=True, max_length=50, null=True)),
                ('install_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('total_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('bat_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('bio_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('coal_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('geo_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('hydro_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('hydrops_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('ng_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('nuclear_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('crude_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('solar_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('wind_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('other_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('source', models.CharField(blank=True, max_length=50, null=True)),
                ('period', models.CharField(blank=True, max_length=50, null=True)),
                ('longitude', models.CharField(blank=True, max_length=50, null=True)),
                ('latitude', models.CharField(blank=True, max_length=50, null=True)),
            ],
            options={
                'db_table': '"eia"."powerplants_hydroelectric"',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Plants_Hydropumped',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('objectid', models.IntegerField()),
                ('plant_code', models.IntegerField()),
                ('plant_name', models.CharField(blank=True, max_length=50, null=True)),
                ('utility_id', models.IntegerField()),
                ('utility_name', models.CharField(blank=True, max_length=50, null=True)),
                ('sector_name', models.CharField(blank=True, max_length=50, null=True)),
                ('street_address', models.CharField(blank=True, max_length=50, null=True)),
                ('city', models.CharField(blank=True, max_length=50, null=True)),
                ('county', models.CharField(blank=True, max_length=50, null=True)),
                ('state', models.CharField(blank=True, max_length=50, null=True)),
                ('zip', models.IntegerField()),
                ('primsource', models.CharField(blank=True, max_length=50, null=True)),
                ('source_desc', models.CharField(blank=True, max_length=50, null=True)),
                ('tech_desc', models.CharField(blank=True, max_length=50, null=True)),
                ('install_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('total_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('bat_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('bio_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('coal_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('geo_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('hydro_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('hydrops_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('ng_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('nuclear_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('crude_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('solar_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('wind_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('other_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('source', models.CharField(blank=True, max_length=50, null=True)),
                ('period', models.CharField(blank=True, max_length=50, null=True)),
                ('longitude', models.CharField(blank=True, max_length=50, null=True)),
                ('latitude', models.CharField(blank=True, max_length=50, null=True)),
            ],
            options={
                'db_table': '"eia"."powerplants_hydropumpedstorage"',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Plants_Naturalgas',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('objectid', models.IntegerField()),
                ('plant_code', models.IntegerField()),
                ('plant_name', models.CharField(blank=True, max_length=50, null=True)),
                ('utility_id', models.IntegerField()),
                ('utility_name', models.CharField(blank=True, max_length=50, null=True)),
                ('sector_name', models.CharField(blank=True, max_length=50, null=True)),
                ('street_address', models.CharField(blank=True, max_length=50, null=True)),
                ('city', models.CharField(blank=True, max_length=50, null=True)),
                ('county', models.CharField(blank=True, max_length=50, null=True)),
                ('state', models.CharField(blank=True, max_length=50, null=True)),
                ('zip', models.IntegerField()),
                ('primsource', models.CharField(blank=True, max_length=50, null=True)),
                ('source_desc', models.CharField(blank=True, max_length=50, null=True)),
                ('tech_desc', models.CharField(blank=True, max_length=50, null=True)),
                ('install_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('total_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('bat_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('bio_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('coal_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('geo_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('hydro_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('hydrops_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('ng_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('nuclear_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('crude_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('solar_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('wind_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('other_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('source', models.CharField(blank=True, max_length=50, null=True)),
                ('period', models.CharField(blank=True, max_length=50, null=True)),
                ('longitude', models.CharField(blank=True, max_length=50, null=True)),
                ('latitude', models.CharField(blank=True, max_length=50, null=True)),
            ],
            options={
                'db_table': '"eia"."powerplants_naturalgas"',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Plants_Nuclear',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('objectid', models.IntegerField()),
                ('plant_code', models.IntegerField()),
                ('plant_name', models.CharField(blank=True, max_length=50, null=True)),
                ('utility_id', models.IntegerField()),
                ('utility_name', models.CharField(blank=True, max_length=50, null=True)),
                ('sector_name', models.CharField(blank=True, max_length=50, null=True)),
                ('street_address', models.CharField(blank=True, max_length=50, null=True)),
                ('city', models.CharField(blank=True, max_length=50, null=True)),
                ('county', models.CharField(blank=True, max_length=50, null=True)),
                ('state', models.CharField(blank=True, max_length=50, null=True)),
                ('zip', models.IntegerField()),
                ('primsource', models.CharField(blank=True, max_length=50, null=True)),
                ('source_desc', models.CharField(blank=True, max_length=50, null=True)),
                ('tech_desc', models.CharField(blank=True, max_length=50, null=True)),
                ('install_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('total_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('bat_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('bio_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('coal_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('geo_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('hydro_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('hydrops_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('ng_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('nuclear_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('crude_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('solar_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('wind_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('other_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('source', models.CharField(blank=True, max_length=50, null=True)),
                ('period', models.CharField(blank=True, max_length=50, null=True)),
                ('longitude', models.CharField(blank=True, max_length=50, null=True)),
                ('latitude', models.CharField(blank=True, max_length=50, null=True)),
            ],
            options={
                'db_table': '"eia"."powerplants_nuclear"',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Plants_Petroleum',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('objectid', models.IntegerField()),
                ('plant_code', models.IntegerField()),
                ('plant_name', models.CharField(blank=True, max_length=50, null=True)),
                ('utility_id', models.IntegerField()),
                ('utility_name', models.CharField(blank=True, max_length=50, null=True)),
                ('sector_name', models.CharField(blank=True, max_length=50, null=True)),
                ('street_address', models.CharField(blank=True, max_length=50, null=True)),
                ('city', models.CharField(blank=True, max_length=50, null=True)),
                ('county', models.CharField(blank=True, max_length=50, null=True)),
                ('state', models.CharField(blank=True, max_length=50, null=True)),
                ('zip', models.IntegerField()),
                ('primsource', models.CharField(blank=True, max_length=50, null=True)),
                ('source_desc', models.CharField(blank=True, max_length=50, null=True)),
                ('tech_desc', models.CharField(blank=True, max_length=50, null=True)),
                ('install_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('total_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('bat_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('bio_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('coal_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('geo_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('hydro_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('hydrops_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('ng_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('nuclear_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('crude_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('solar_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('wind_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('other_mw', models.CharField(blank=True, max_length=50, null=True)),
                ('source', models.CharField(blank=True, max_length=50, null=True)),
                ('period', models.CharField(blank=True, max_length=50, null=True)),
                ('longitude', models.CharField(blank=True, max_length=50, null=True)),
                ('latitude', models.CharField(blank=True, max_length=50, null=True)),
            ],
            options={
                'db_table': '"eia"."powerplants_petroleum"',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Plants_Processing_Naturalgas',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('objectid', models.IntegerField()),
                ('plant_name', models.CharField(blank=True, max_length=50, null=True)),
                ('owner', models.CharField(blank=True, max_length=50, null=True)),
                ('operator', models.CharField(blank=True, max_length=50, null=True)),
                ('state', models.CharField(blank=True, max_length=50, null=True)),
                ('county', models.CharField(blank=True, max_length=50, null=True)),
                ('city', models.CharField(blank=True, max_length=50, null=True)),
                ('zipcode', models.CharField(blank=True, max_length=50, null=True)),
                ('cap_mmcfd', models.CharField(blank=True, max_length=50, null=True)),
                ('plant_flow', models.CharField(blank=True, max_length=50, null=True)),
                ('btu_content', models.CharField(blank=True, max_length=50, null=True)),
                ('dry_stor', models.IntegerField()),
                ('ngl_stor', models.IntegerField()),
                ('longitude', models.CharField(blank=True, max_length=50, null=True)),
                ('latitude', models.CharField(blank=True, max_length=50, null=True)),
                ('period', models.IntegerField()),
                ('source', models.CharField(blank=True, max_length=50, null=True)),
                ('loc_source', models.CharField(blank=True, max_length=50, null=True)),
            ],
            options={
                'db_table': '"eia"."processing_plants_naturalgas"',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Plants_Refinery_Petroleum',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('objectid', models.IntegerField()),
                ('site_id', models.IntegerField()),
                ('company', models.CharField(blank=True, max_length=50, null=True)),
                ('corp', models.CharField(blank=True, max_length=50, null=True)),
                ('site', models.CharField(blank=True, max_length=50, null=True)),
                ('state', models.CharField(blank=True, max_length=50, null=True)),
                ('padd', models.IntegerField()),
                ('ad_mbpd', models.CharField(blank=True, max_length=50, null=True)),
                ('vdist_mbpd', models.CharField(blank=True, max_length=50, null=True)),
                ('cadis_mbpd', models.CharField(blank=True, max_length=50, null=True)),
                ('hycrk_mbpd', models.CharField(blank=True, max_length=50, null=True)),
                ('vredu_mbpd', models.CharField(blank=True, max_length=50, null=True)),
                ('caref_mbpd', models.CharField(blank=True, max_length=50, null=True)),
                ('isal_mbpd', models.CharField(blank=True, max_length=50, null=True)),
                ('hds_mbpd', models.CharField(blank=True, max_length=50, null=True)),
                ('cokin_mbpd', models.CharField(blank=True, max_length=50, null=True)),
                ('asph_mbpd', models.CharField(blank=True, max_length=50, null=True)),
                ('source', models.CharField(blank=True, max_length=50, null=True)),
                ('period', models.CharField(blank=True, max_length=50, null=True)),
                ('latitude', models.CharField(blank=True, max_length=50, null=True)),
                ('longitude', models.CharField(blank=True, max_length=50, null=True)),
                ('link_imports', models.IntegerField()),
            ],
            options={
                'db_table': '"eia"."refineries_petroleum"',
                'managed': False,
            },
        ),
    ]
