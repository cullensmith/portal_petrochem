from django.db import models

class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        app_label = 'petrochem'
        # db_table = 'auth_group'

# Create your models here.
class States(models.Model):
    geomjson = models.CharField(max_length=255)
    statename = models.CharField(max_length=255)
    class Meta:
        managed = False
        db_table = '"public"."states_json"'
    
    def __str__(self) -> str:
        return super().__str__()
    
class Counties(models.Model):
    geomjson = models.CharField(max_length=255)
    statename = models.CharField(max_length=255)
    stusps = models.CharField(max_length=10)
    county = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = '"public"."counties_json"'
    
    def __str__(self) -> str:
        return super().__str__()
    
 

class Compressors(models.Model):
    id = models.IntegerField(primary_key=True, db_column='id')
    name = models.CharField(max_length=50, blank=True, null=True, db_column='name')
    address = models.CharField(max_length=50, blank=True, null=True, db_column='address')
    city = models.CharField(max_length=50, blank=True, null=True, db_column='city')
    state = models.CharField(max_length=50, blank=True, null=True, db_column='state')
    zip = models.CharField(max_length=50, blank=True, null=True, db_column='zip')
    type = models.CharField(max_length=50, blank=True, null=True, db_column='type')
    status = models.CharField(max_length=50, blank=True, null=True, db_column='status')
    county = models.CharField(max_length=50, blank=True, null=True, db_column='county')
    latitude = models.FloatField(blank=True, null=True, db_column='latitude')
    longitude = models.FloatField(blank=True, null=True, db_column='longitude')
    naics_code = models.CharField(max_length=50, blank=True, null=True, db_column='naics_code')
    naics_desc = models.CharField(max_length=50, blank=True, null=True, db_column='naics_desc')
    source = models.CharField(max_length=50, blank=True, null=True, db_column='source')
    website = models.CharField(max_length=50, blank=True, null=True, db_column='website')
    pipeco = models.CharField(max_length=50, blank=True, null=True, db_column='pipeco')
    operator = models.CharField(max_length=50, blank=True, null=True, db_column='operator')
    num_units = models.CharField(max_length=50, blank=True, null=True, db_column='num_units')
    cert_horsepower = models.CharField(max_length=50, blank=True, null=True, db_column='cert_hp')
    plant_cost = models.CharField(max_length=50, blank=True, null=True, db_column='plant_cost')
    exp_fuel = models.CharField(max_length=50, blank=True, null=True, db_column='exp_fuel')
    exp_other = models.CharField(max_length=50, blank=True, null=True, db_column='exp_other')
    vol_gas_compressed = models.CharField(max_length=50, blank=True, null=True, db_column='gas_compre')
    op_comp_hr = models.CharField(max_length=50, blank=True, null=True, db_column='op_comp_hr')
    op_num_com = models.CharField(max_length=50, blank=True, null=True, db_column='op_num_com')
    op_date_pe = models.CharField(max_length=50, blank=True, null=True, db_column='op_date_pe')
    exp_power = models.CharField(max_length=50, blank=True, null=True, db_column='exp_power')
    elec_compr = models.CharField(max_length=50, blank=True, null=True, db_column='elec_compr')
    class Meta:
        managed = False
        db_table = '"eia"."compressor_stations_naturalgas"'
    
    def __str__(self) -> str:
        return super().__str__()
    

class Pipeline_Crudeoil(models.Model):
    geomjson = models.CharField(max_length=500, blank=True, null=True)
    id = models.IntegerField(primary_key=True)
    opername = models.CharField(max_length=50, blank=True, null=True)
    pipename = models.CharField(max_length=50, blank=True, null=True)
    # geom = models.CharField(max_length=50, blank=True, null=True)
    fid = models.IntegerField()

    class Meta:
        managed = False
        db_table = '"pipelines"."crudeoil"'
    
    def __str__(self) -> str:
        return super().__str__()
    
class Pipeline_FracTracker(models.Model):
    ftid = models.IntegerField()
    # geom = models.CharField(max_length=100, blank=True, null=True)
    name = models.CharField(max_length=50, blank=True, null=True)
    status = models.CharField(max_length=30, blank=True, null=True)
    company = models.CharField(max_length=80, blank=True, null=True)
    estinservd = models.CharField(max_length=50, blank=True, null=True)
    loresdelet = models.CharField(max_length=5, blank=True, null=True)
    res = models.CharField(max_length=50, blank=True, null=True)
    srcelink = models.CharField(max_length=250, blank=True, null=True)
    product = models.CharField(max_length=50, blank=True, null=True)
    state = models.CharField(max_length=50, blank=True, null=True)
    notes = models.CharField(max_length=50, blank=True, null=True)
    digname = models.CharField(max_length=100, blank=True, null=True)
    digdate = models.CharField(max_length=50, blank=True, null=True)
    datasrce = models.CharField(max_length=100, blank=True, null=True)
    id = models.IntegerField(primary_key=True)
    length = models.FloatField(blank=True, null=True)
    diameter = models.CharField(max_length=50, blank=True, null=True)
    geomjson = models.CharField(max_length=7000000, blank=True, null=True)

    class Meta:
        managed = False
        db_table = '"pipelines"."fractracker"'
    
    def __str__(self) -> str:
        return super().__str__()
    
class Pipeline_hgl(models.Model):
    id = models.IntegerField(primary_key=True)
    fid = models.IntegerField()
    opername = models.CharField(max_length=150, blank=True, null=True)
    pipename = models.CharField(max_length=150, blank=True, null=True)
    geomjson = models.CharField(max_length=1600, blank=True, null=True)

    class Meta:
        managed = False
        db_table = '"pipelines"."hgl"'
    
    def __str__(self) -> str:
        return super().__str__()
    

class Pipeline_Naturalgas(models.Model):
    id = models.IntegerField(primary_key=True)
    fid = models.IntegerField()
    typepipe = models.CharField(max_length=10, blank=True, null=True)
    operator = models.CharField(max_length=50, blank=True, null=True)
    status = models.CharField(max_length=50, blank=True, null=True)
    geomjson = models.CharField(max_length=48000, blank=True, null=True)

    
    class Meta:
        managed = False
        db_table = '"pipelines"."naturalgas"'
    
    def __str__(self) -> str:
        return super().__str__()
    
class Pipeline_Petroleum(models.Model):
    geom = models.CharField(max_length=100, blank=True, null=True)
    id = models.IntegerField(primary_key=True)
    fid = models.IntegerField()
    opername = models.CharField(max_length=75, blank=True, null=True)
    pipename = models.CharField(max_length=100, blank=True, null=True)
    geomjson = models.CharField(max_length=500, blank=True, null=True)

    class Meta:
        managed = False
        db_table = '"pipelines"."petroleum"'
    
    def __str__(self) -> str:
        return super().__str__()
    
class Bordercrossing_Electric(models.Model):
    id = models.IntegerField(primary_key=True, db_column='id')
    linename = models.CharField(max_length=50, blank=True, null=True, db_column='linename')
    owner = models.CharField(max_length=50, blank=True, null=True, db_column='owner')
    latitude = models.CharField(max_length=50, blank=True, null=True, db_column='latitude')
    longitude = models.CharField(max_length=50, blank=True, null=True, db_column='longitude')
    city = models.CharField(max_length=50, blank=True, null=True, db_column='city')
    county = models.CharField(max_length=50, blank=True, null=True, db_column='county')
    state = models.CharField(max_length=50, blank=True, null=True, db_column='stateprov')
    from_state = models.CharField(max_length=50, blank=True, null=True, db_column='frmstate')
    to_state = models.CharField(max_length=50, blank=True, null=True, db_column='tostate')
    volatage_kv = models.CharField(max_length=50, blank=True, null=True, db_column='voltage_kv')
    class Meta:
        managed = False
        db_table = '"eia"."bordercrossing_electric"'
    
    def __str__(self) -> str:
        return super().__str__()
    
class Bordercrossing_Liquids(models.Model):
    id = models.IntegerField(primary_key=True, db_column='id')
    pipeline = models.CharField(max_length=254, blank=True, null=True, db_column='pipeline')
    owner = models.CharField(max_length=254, blank=True, null=True, db_column='owner')
    latitude = models.FloatField(blank=True, null=True, db_column='latitude')
    longitude = models.FloatField(blank=True, null=True, db_column='longitude')
    city = models.CharField(max_length=254, blank=True, null=True, db_column='city')
    county = models.CharField(max_length=254, blank=True, null=True, db_column='county')
    state = models.CharField(max_length=254, blank=True, null=True, db_column='state')
    from_state = models.CharField(max_length=254, blank=True, null=True, db_column='frmstate')
    to_state = models.CharField(max_length=254, blank=True, null=True, db_column='tostate')
    typeprod = models.CharField(max_length=254, blank=True, null=True, db_column='typeprod')
    num_pipes = models.IntegerField()
    diameter = models.CharField(max_length=254, blank=True, null=True, db_column='diameter')

    class Meta:
        managed = False
        db_table = '"eia"."bordercrossing_liquids"'
    
    def __str__(self) -> str:
        return super().__str__()
    
class Bordercrossing_Naturalgas(models.Model):
    id = models.IntegerField(primary_key=True, db_column='id')
    pipeline = models.CharField(max_length=254, blank=True, null=True, db_column='pipeline')
    owner = models.CharField(max_length=254, blank=True, null=True, db_column='owner')
    latitude = models.FloatField(blank=True, null=True, db_column='latitude')
    longitude = models.FloatField(blank=True, null=True, db_column='longitude')
    city = models.CharField(max_length=254, blank=True, null=True, db_column='city')
    county = models.CharField(max_length=254, blank=True, null=True, db_column='county')
    state = models.CharField(max_length=254, blank=True, null=True, db_column='state')
    from_state = models.CharField(max_length=254, blank=True, null=True, db_column='frmstate')
    to_state = models.CharField(max_length=254, blank=True, null=True, db_column='tostate')
    volume_mmcfd = models.IntegerField(db_column='vol_mmcfd')

    class Meta:
        managed = False
        db_table = '"eia"."bordercrossing_naturalgas"'
    
    def __str__(self) -> str:
        return super().__str__()
    

class Electric_Generator_Inventory_860m(models.Model):
    id = models.IntegerField(primary_key=True)
    status_1 = models.CharField(max_length=500, blank=True, null=True)
    rpt_dt = models.CharField(max_length=500, blank=True, null=True)
    ent_id = models.CharField(max_length=500, blank=True, null=True)
    ent_name = models.CharField(max_length=500, blank=True, null=True)
    plnt_id = models.CharField(max_length=500, blank=True, null=True)
    plnt_nm = models.CharField(max_length=500, blank=True, null=True)
    state = models.CharField(max_length=500, blank=True, null=True)
    county = models.CharField(max_length=500, blank=True, null=True)
    balauth = models.CharField(max_length=500, blank=True, null=True)
    sector = models.CharField(max_length=500, blank=True, null=True)
    gen_id = models.CharField(max_length=500, blank=True, null=True)
    npl_cap_mw = models.CharField(max_length=500, blank=True, null=True)
    techn = models.CharField(max_length=500, blank=True, null=True)
    egy_src = models.CharField(max_length=500, blank=True, null=True)
    prm_mvr = models.CharField(max_length=500, blank=True, null=True)
    opr_mo = models.CharField(max_length=500, blank=True, null=True)
    opr_yr = models.CharField(max_length=500, blank=True, null=True)
    pln_mo = models.CharField(max_length=500, blank=True, null=True)
    pln_yr = models.CharField(max_length=500, blank=True, null=True)
    retr_mo = models.CharField(max_length=500, blank=True, null=True)
    retr_yr = models.CharField(max_length=500, blank=True, null=True)
    status_2 = models.CharField(max_length=500, blank=True, null=True)
    lat = models.CharField(max_length=500, blank=True, null=True)
    long = models.CharField(max_length=500, blank=True, null=True)
    x = models.CharField(max_length=500, blank=True, null=True)
    y = models.CharField(max_length=500, blank=True, null=True)

    class Meta:
        managed = False
        db_table = '"eia"."electric_generator_inventory_860m"'
    
    def __str__(self) -> str:
        return super().__str__()
    

class Markethubs_Hgl(models.Model):
    ftid = models.IntegerField()
    fid = models.IntegerField()
    id = models.IntegerField(primary_key=True)
    state = models.CharField(max_length=50, blank=True, null=True)
    facility = models.CharField(max_length=50, blank=True, null=True)
    longitude = models.CharField(max_length=50, blank=True, null=True)
    latitude = models.CharField(max_length=50, blank=True, null=True)
    x = models.CharField(max_length=50, blank=True, null=True)
    y = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = '"eia"."markethubs_hgl"'
    
    def __str__(self) -> str:
        return super().__str__()
    
class Markethubs_Naturalgas(models.Model):
    id = models.IntegerField(primary_key=True, db_column='id')
    hubname = models.CharField(max_length=50, blank=True, null=True, db_column='hubname')
    period = models.IntegerField()
    latitude = models.CharField(max_length=50, blank=True, null=True, db_column='latitude')
    longitude = models.CharField(max_length=50, blank=True, null=True, db_column='longitude')
    class Meta:
        managed = False
        db_table = '"eia"."markethubs_naturalgas"'
    
    def __str__(self) -> str:
        return super().__str__()
    
class Ports_Petroleum(models.Model):
    id = models.IntegerField(primary_key=True, db_column='id')
    port_code = models.CharField(max_length=50, blank=True, null=True, db_column='portcode')
    name = models.CharField(max_length=50, blank=True, null=True, db_column='name')
    state = models.CharField(max_length=50, blank=True, null=True, db_column='state')
    longitude = models.CharField(max_length=50, blank=True, null=True, db_column='longitude')
    latitude = models.CharField(max_length=50, blank=True, null=True, db_column='latitude')

    class Meta:
        managed = False
        db_table = '"eia"."ports_petroleum"'
    
    def __str__(self) -> str:
        return super().__str__()
    
class Buffs(models.Model):
    id = models.IntegerField(primary_key=True)
    original_t = models.CharField(max_length=50, blank=True, null=True)
    categoryid = models.IntegerField()
    longitude = models.CharField(max_length=50, blank=True, null=True)
    latitude = models.CharField(max_length=50, blank=True, null=True)
    buff_dist = models.CharField(max_length=50, blank=True, null=True)
    orig_fid = models.IntegerField()
    shape_leng = models.CharField(max_length=50, blank=True, null=True)
    shape_le_1 = models.CharField(max_length=50, blank=True, null=True)
    shape_area = models.CharField(max_length=50, blank=True, null=True)
    sum_area_s = models.CharField(max_length=50, blank=True, null=True)
    polygon_co = models.IntegerField()
    tablcode = models.CharField(max_length=50, blank=True, null=True)
    tc_ctid = models.CharField(max_length=50, blank=True, null=True)
    j_tpop = models.CharField(max_length=50, blank=True, null=True)
    j_wht = models.CharField(max_length=50, blank=True, null=True)
    j_b_aa = models.CharField(max_length=50, blank=True, null=True)
    j_ai_an = models.CharField(max_length=50, blank=True, null=True)
    j_asn = models.CharField(max_length=50, blank=True, null=True)
    j_nh_opi = models.CharField(max_length=50, blank=True, null=True)
    j_oth = models.CharField(max_length=50, blank=True, null=True)
    j_2r = models.CharField(max_length=50, blank=True, null=True)
    j_hl = models.CharField(max_length=50, blank=True, null=True)
    j_18 = models.CharField(max_length=50, blank=True, null=True)
    j_nw = models.CharField(max_length=50, blank=True, null=True)
    j_u18 = models.CharField(max_length=50, blank=True, null=True)
    # geomjson = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = '"eia"."petrofacill_1km_pop_042025"'
    
    def __str__(self) -> str:
        return super().__str__()
    
class Powerplants_Batterystorage(models.Model):
    id = models.IntegerField(primary_key=True, db_column='id')
    plant_code = models.IntegerField()
    plant_name = models.CharField(max_length=50, blank=True, null=True, db_column='plant_name')
    utility_id = models.IntegerField()
    utility_name = models.CharField(max_length=50, blank=True, null=True, db_column='utility_name')
    sector_name = models.CharField(max_length=50, blank=True, null=True, db_column='sector_name')
    street_address = models.CharField(max_length=50, blank=True, null=True, db_column='street_address')
    city = models.CharField(max_length=50, blank=True, null=True, db_column='city')
    county = models.CharField(max_length=50, blank=True, null=True, db_column='county')
    state = models.CharField(max_length=50, blank=True, null=True, db_column='state')
    zip = models.IntegerField()
    primary_source = models.CharField(max_length=50, blank=True, null=True, db_column='primsource')
    tech_desc = models.CharField(max_length=50, blank=True, null=True, db_column='tech_desc')
    install_mw = models.CharField(max_length=50, blank=True, null=True, db_column='install_mw')
    total_mw = models.CharField(max_length=50, blank=True, null=True, db_column='total_mw')
    battery_mw = models.CharField(max_length=50, blank=True, null=True, db_column='bat_mw')
    biodiesel_mw = models.CharField(max_length=50, blank=True, null=True, db_column='bio_mw')
    coal_mw = models.CharField(max_length=50, blank=True, null=True, db_column='coal_mw')
    geothermal_mw = models.CharField(max_length=50, blank=True, null=True, db_column='geo_mw')
    hydro_mw = models.CharField(max_length=50, blank=True, null=True, db_column='hydro_mw')
    hydrops_mw = models.CharField(max_length=50, blank=True, null=True, db_column='hydrops_mw')
    naturalgas_mw = models.CharField(max_length=50, blank=True, null=True, db_column='ng_mw')
    nuclear_mw = models.CharField(max_length=50, blank=True, null=True, db_column='nuclear_mw')
    crude_mw = models.CharField(max_length=50, blank=True, null=True, db_column='crude_mw')
    solar_mw = models.CharField(max_length=50, blank=True, null=True, db_column='solar_mw')
    wind_mw = models.CharField(max_length=50, blank=True, null=True, db_column='wind_mw')
    other_mw = models.CharField(max_length=50, blank=True, null=True, db_column='other_mw')
    source = models.CharField(max_length=50, blank=True, null=True, db_column='source')
    period = models.CharField(max_length=50, blank=True, null=True, db_column='period')
    longitude = models.CharField(max_length=50, blank=True, null=True, db_column='longitude')
    latitude = models.CharField(max_length=50, blank=True, null=True, db_column='latitude')
    
    class Meta:
        managed = False
        db_table = '"eia"."powerplants_batterystorage"'
    
    def __str__(self) -> str:
        return super().__str__()
    
class Electric_Generator(models.Model):
    id = models.IntegerField(primary_key=True)
    status_1 = models.CharField(max_length=50, blank=True, null=True)
    rpt_dt = models.CharField(max_length=50, blank=True, null=True)
    ent_id = models.CharField(max_length=50, blank=True, null=True)
    ent_name = models.CharField(max_length=50, blank=True, null=True)
    plnt_id = models.CharField(max_length=50, blank=True, null=True)
    plnt_nm = models.CharField(max_length=50, blank=True, null=True)
    state = models.CharField(max_length=50, blank=True, null=True)
    county = models.CharField(max_length=50, blank=True, null=True)
    balauth = models.CharField(max_length=50, blank=True, null=True)
    sector = models.CharField(max_length=50, blank=True, null=True)
    gen_id = models.CharField(max_length=50, blank=True, null=True)
    npl_cap_mw = models.CharField(max_length=50, blank=True, null=True)
    techn = models.CharField(max_length=50, blank=True, null=True)
    egy_src = models.CharField(max_length=50, blank=True, null=True)
    prm_mvr = models.CharField(max_length=50, blank=True, null=True)
    opr_mo = models.CharField(max_length=50, blank=True, null=True)
    opr_yr = models.CharField(max_length=50, blank=True, null=True)
    pln_mo = models.CharField(max_length=50, blank=True, null=True)
    pln_yr = models.CharField(max_length=50, blank=True, null=True)
    retr_mo = models.CharField(max_length=50, blank=True, null=True)
    retr_yr = models.CharField(max_length=50, blank=True, null=True)
    status_2 = models.CharField(max_length=50, blank=True, null=True)
    lat = models.CharField(max_length=50, blank=True, null=True)
    long = models.CharField(max_length=50, blank=True, null=True)
    x = models.CharField(max_length=50, blank=True, null=True)
    y = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = '"eia"."electric_generator_inventory_860m"'
    
    def __str__(self) -> str:
        return super().__str__()

class Plants_Biodiesel(models.Model):
    id = models.IntegerField(primary_key=True, db_column='id')
    company = models.CharField(max_length=50, blank=True, null=True, db_column='company')
    site = models.CharField(max_length=50, blank=True, null=True, db_column='site')
    state = models.CharField(max_length=50, blank=True, null=True, db_column='state')
    padd = models.IntegerField()
    capacity_mmgal = models.IntegerField(db_column='cap_mmgal')
    source = models.CharField(max_length=50, blank=True, null=True, db_column='source')
    period = models.CharField(max_length=50, blank=True, null=True, db_column='period')
    longitude = models.CharField(max_length=50, blank=True, null=True, db_column='longitude')
    latitude = models.CharField(max_length=50, blank=True, null=True, db_column='latitude')

    class Meta:
        managed = False
        db_table = '"eia"."plants_biodiesel"'
    
    def __str__(self) -> str:
        return super().__str__()
    
class Plants_Ethanol(models.Model):
    id = models.IntegerField(primary_key=True, db_column='id')
    company = models.CharField(max_length=50, blank=True, null=True, db_column='company')
    site = models.CharField(max_length=50, blank=True, null=True, db_column='site')
    state = models.CharField(max_length=50, blank=True, null=True, db_column='state')
    padd = models.IntegerField()
    capacity_mmgal = models.IntegerField(db_column='cap_mmgal')
    source = models.CharField(max_length=50, blank=True, null=True, db_column='source')
    period = models.CharField(max_length=50, blank=True, null=True, db_column='period')
    longitude = models.CharField(max_length=50, blank=True, null=True, db_column='longitude')
    latitude = models.CharField(max_length=50, blank=True, null=True, db_column='latitude')

    class Meta:
        managed = False
        db_table = '"eia"."plants_ethanol"'
    
    def __str__(self) -> str:
        return super().__str__()
    
class Plants_Ethylene_Cracker(models.Model):
    id = models.IntegerField(primary_key=True, db_column='id')
    company = models.CharField(max_length=50, blank=True, null=True, db_column='company')
    site = models.CharField(max_length=50, blank=True, null=True, db_column='site')
    county = models.CharField(max_length=50, blank=True, null=True, db_column='county')
    state = models.CharField(max_length=50, blank=True, null=True, db_column='state')
    padd = models.IntegerField()
    source = models.CharField(max_length=50, blank=True, null=True, db_column='source')
    period = models.CharField(max_length=50, blank=True, null=True, db_column='period')
    longitude = models.CharField(max_length=50, blank=True, null=True, db_column='longitude')
    latitude = models.CharField(max_length=50, blank=True, null=True, db_column='latitude')

    class Meta:
        managed = False
        db_table = '"eia"."plants_ethylene_cracker"'
    
    def __str__(self) -> str:
        return super().__str__()
    
class Plants_Coal(models.Model):
    id = models.IntegerField(primary_key=True, db_column='id')
    plant_code = models.IntegerField()
    plant_name = models.CharField(max_length=50, blank=True, null=True, db_column='plant_name')
    utility_id = models.IntegerField()
    utility_name = models.CharField(max_length=50, blank=True, null=True, db_column='utility_name')
    sector_name = models.CharField(max_length=50, blank=True, null=True, db_column='sector_name')
    street_address = models.CharField(max_length=50, blank=True, null=True, db_column='street_address')
    city = models.CharField(max_length=50, blank=True, null=True, db_column='city')
    county = models.CharField(max_length=50, blank=True, null=True, db_column='county')
    state = models.CharField(max_length=50, blank=True, null=True, db_column='state')
    zip = models.IntegerField()
    primary_source = models.CharField(max_length=50, blank=True, null=True, db_column='primsource')
    source_desc = models.CharField(max_length=50, blank=True, null=True, db_column='source_desc')
    tech_desc = models.CharField(max_length=50, blank=True, null=True, db_column='tech_desc')
    install_mw = models.CharField(max_length=50, blank=True, null=True, db_column='install_mw')
    total_mw = models.CharField(max_length=50, blank=True, null=True, db_column='total_mw')
    battery_mw = models.CharField(max_length=50, blank=True, null=True, db_column='bat_mw')
    biodiesel_mw = models.CharField(max_length=50, blank=True, null=True, db_column='bio_mw')
    coal_mw = models.CharField(max_length=50, blank=True, null=True, db_column='coal_mw')
    geothermal_mw = models.CharField(max_length=50, blank=True, null=True, db_column='geo_mw')
    hydro_mw = models.CharField(max_length=50, blank=True, null=True, db_column='hydro_mw')
    hydrops_mw = models.CharField(max_length=50, blank=True, null=True, db_column='hydrops_mw')
    naturalgas_mw = models.CharField(max_length=50, blank=True, null=True, db_column='ng_mw')
    nuclear_mw = models.CharField(max_length=50, blank=True, null=True, db_column='nuclear_mw')
    crude_mw = models.CharField(max_length=50, blank=True, null=True, db_column='crude_mw')
    solar_mw = models.CharField(max_length=50, blank=True, null=True, db_column='solar_mw')
    wind_mw = models.CharField(max_length=50, blank=True, null=True, db_column='wind_mw')
    other_mw = models.CharField(max_length=50, blank=True, null=True, db_column='other_mw')
    source = models.CharField(max_length=50, blank=True, null=True, db_column='source')
    period = models.CharField(max_length=50, blank=True, null=True, db_column='period')
    longitude = models.CharField(max_length=50, blank=True, null=True, db_column='longitude')
    latitude = models.CharField(max_length=50, blank=True, null=True, db_column='latitude')
    class Meta:
        managed = False
        db_table = '"eia"."powerplants_coal"'
    
    def __str__(self) -> str:
        return super().__str__()

class Plants_Geothermal(models.Model):
    id = models.IntegerField(primary_key=True, db_column='id')
    plant_code = models.IntegerField()
    plant_name = models.CharField(max_length=50, blank=True, null=True, db_column='plant_name')
    utility_id = models.IntegerField()
    utility_name = models.CharField(max_length=50, blank=True, null=True, db_column='utility_name')
    sector_name = models.CharField(max_length=50, blank=True, null=True, db_column='sector_name')
    street_address = models.CharField(max_length=50, blank=True, null=True, db_column='street_address')
    city = models.CharField(max_length=50, blank=True, null=True, db_column='city')
    county = models.CharField(max_length=50, blank=True, null=True, db_column='county')
    state = models.CharField(max_length=50, blank=True, null=True, db_column='state')
    zip = models.IntegerField()
    primary_source = models.CharField(max_length=50, blank=True, null=True, db_column='primsource')
    source_desc = models.CharField(max_length=50, blank=True, null=True, db_column='source_desc')
    tech_desc = models.CharField(max_length=50, blank=True, null=True, db_column='tech_desc')
    install_mw = models.CharField(max_length=50, blank=True, null=True, db_column='install_mw')
    total_mw = models.CharField(max_length=50, blank=True, null=True, db_column='total_mw')
    battery_mw = models.CharField(max_length=50, blank=True, null=True, db_column='bat_mw')
    biodiesel_mw = models.CharField(max_length=50, blank=True, null=True, db_column='bio_mw')
    coal_mw = models.CharField(max_length=50, blank=True, null=True, db_column='coal_mw')
    geothermal_mw = models.CharField(max_length=50, blank=True, null=True, db_column='geo_mw')
    hydro_mw = models.CharField(max_length=50, blank=True, null=True, db_column='hydro_mw')
    hydrops_mw = models.CharField(max_length=50, blank=True, null=True, db_column='hydrops_mw')
    naturalgas_mw = models.CharField(max_length=50, blank=True, null=True, db_column='ng_mw')
    nuclear_mw = models.CharField(max_length=50, blank=True, null=True, db_column='nuclear_mw')
    crude_mw = models.CharField(max_length=50, blank=True, null=True, db_column='crude_mw')
    solar_mw = models.CharField(max_length=50, blank=True, null=True, db_column='solar_mw')
    wind_mw = models.CharField(max_length=50, blank=True, null=True, db_column='wind_mw')
    other_mw = models.CharField(max_length=50, blank=True, null=True, db_column='other_mw')
    source = models.CharField(max_length=50, blank=True, null=True, db_column='source')
    period = models.CharField(max_length=50, blank=True, null=True, db_column='period')
    longitude = models.CharField(max_length=50, blank=True, null=True, db_column='longitude')
    latitude = models.CharField(max_length=50, blank=True, null=True, db_column='latitude')
    class Meta:
        managed = False
        db_table = '"eia"."powerplants_geothermal"'
    
    def __str__(self) -> str:
        return super().__str__()


class Plants_Hydroelectric(models.Model):
    id = models.IntegerField(primary_key=True, db_column='id')
    plant_code = models.IntegerField()
    plant_name = models.CharField(max_length=50, blank=True, null=True, db_column='plant_name')
    utility_id = models.IntegerField()
    utility_name = models.CharField(max_length=50, blank=True, null=True, db_column='utility_name')
    sector_name = models.CharField(max_length=50, blank=True, null=True, db_column='sector_name')
    street_address = models.CharField(max_length=50, blank=True, null=True, db_column='street_address')
    city = models.CharField(max_length=50, blank=True, null=True, db_column='city')
    county = models.CharField(max_length=50, blank=True, null=True, db_column='county')
    state = models.CharField(max_length=50, blank=True, null=True, db_column='state')
    zip = models.IntegerField()
    primary_source = models.CharField(max_length=50, blank=True, null=True, db_column='primsource')
    source_desc = models.CharField(max_length=50, blank=True, null=True, db_column='source_desc')
    tech_desc = models.CharField(max_length=50, blank=True, null=True, db_column='tech_desc')
    install_mw = models.CharField(max_length=50, blank=True, null=True, db_column='install_mw')
    total_mw = models.CharField(max_length=50, blank=True, null=True, db_column='total_mw')
    battery_mw = models.CharField(max_length=50, blank=True, null=True, db_column='bat_mw')
    biodiesel_mw = models.CharField(max_length=50, blank=True, null=True, db_column='bio_mw')
    coal_mw = models.CharField(max_length=50, blank=True, null=True, db_column='coal_mw')
    geothermal_mw = models.CharField(max_length=50, blank=True, null=True, db_column='geo_mw')
    hydro_mw = models.CharField(max_length=50, blank=True, null=True, db_column='hydro_mw')
    hydrops_mw = models.CharField(max_length=50, blank=True, null=True, db_column='hydrops_mw')
    naturalgas_mw = models.CharField(max_length=50, blank=True, null=True, db_column='ng_mw')
    nuclear_mw = models.CharField(max_length=50, blank=True, null=True, db_column='nuclear_mw')
    crude_mw = models.CharField(max_length=50, blank=True, null=True, db_column='crude_mw')
    solar_mw = models.CharField(max_length=50, blank=True, null=True, db_column='solar_mw')
    wind_mw = models.CharField(max_length=50, blank=True, null=True, db_column='wind_mw')
    other_mw = models.CharField(max_length=50, blank=True, null=True, db_column='other_mw')
    source = models.CharField(max_length=50, blank=True, null=True, db_column='source')
    period = models.CharField(max_length=50, blank=True, null=True, db_column='period')
    longitude = models.CharField(max_length=50, blank=True, null=True, db_column='longitude')
    latitude = models.CharField(max_length=50, blank=True, null=True, db_column='latitude')
    class Meta:
        managed = False
        db_table = '"eia"."powerplants_hydroelectric"'
    
    def __str__(self) -> str:
        return super().__str__()


class Plants_Hydropumped(models.Model):
    id = models.IntegerField(primary_key=True, db_column='id')
    plant_code = models.IntegerField()
    plant_name = models.CharField(max_length=50, blank=True, null=True, db_column='plant_name')
    utility_id = models.IntegerField()
    utility_name = models.CharField(max_length=50, blank=True, null=True, db_column='utility_name')
    sector_name = models.CharField(max_length=50, blank=True, null=True, db_column='sector_name')
    street_address = models.CharField(max_length=50, blank=True, null=True, db_column='street_address')
    city = models.CharField(max_length=50, blank=True, null=True, db_column='city')
    county = models.CharField(max_length=50, blank=True, null=True, db_column='county')
    state = models.CharField(max_length=50, blank=True, null=True, db_column='state')
    zip = models.IntegerField()
    primary_source = models.CharField(max_length=50, blank=True, null=True, db_column='primsource')
    source_desc = models.CharField(max_length=50, blank=True, null=True, db_column='source_desc')
    tech_desc = models.CharField(max_length=50, blank=True, null=True, db_column='tech_desc')
    install_mw = models.CharField(max_length=50, blank=True, null=True, db_column='install_mw')
    total_mw = models.CharField(max_length=50, blank=True, null=True, db_column='total_mw')
    battery_mw = models.CharField(max_length=50, blank=True, null=True, db_column='bat_mw')
    biodiesel_mw = models.CharField(max_length=50, blank=True, null=True, db_column='bio_mw')
    coal_mw = models.CharField(max_length=50, blank=True, null=True, db_column='coal_mw')
    geothermal_mw = models.CharField(max_length=50, blank=True, null=True, db_column='geo_mw')
    hydro_mw = models.CharField(max_length=50, blank=True, null=True, db_column='hydro_mw')
    hydrops_mw = models.CharField(max_length=50, blank=True, null=True, db_column='hydrops_mw')
    naturalgas_mw = models.CharField(max_length=50, blank=True, null=True, db_column='ng_mw')
    nuclear_mw = models.CharField(max_length=50, blank=True, null=True, db_column='nuclear_mw')
    crude_mw = models.CharField(max_length=50, blank=True, null=True, db_column='crude_mw')
    solar_mw = models.CharField(max_length=50, blank=True, null=True, db_column='solar_mw')
    wind_mw = models.CharField(max_length=50, blank=True, null=True, db_column='wind_mw')
    other_mw = models.CharField(max_length=50, blank=True, null=True, db_column='other_mw')
    source = models.CharField(max_length=50, blank=True, null=True, db_column='source')
    period = models.CharField(max_length=50, blank=True, null=True, db_column='period')
    longitude = models.CharField(max_length=50, blank=True, null=True, db_column='longitude')
    latitude = models.CharField(max_length=50, blank=True, null=True, db_column='latitude')
    class Meta:
        managed = False
        db_table = '"eia"."powerplants_hydropumpedstorage"'
    
    def __str__(self) -> str:
        return super().__str__()

class Plants_Naturalgas(models.Model):
    id = models.IntegerField(primary_key=True, db_column='id')
    plant_code = models.IntegerField()
    plant_name = models.CharField(max_length=50, blank=True, null=True, db_column='plant_name')
    utility_id = models.IntegerField()
    utility_name = models.CharField(max_length=50, blank=True, null=True, db_column='utility_name')
    sector_name = models.CharField(max_length=50, blank=True, null=True, db_column='sector_name')
    street_address = models.CharField(max_length=50, blank=True, null=True, db_column='street_address')
    city = models.CharField(max_length=50, blank=True, null=True, db_column='city')
    county = models.CharField(max_length=50, blank=True, null=True, db_column='county')
    state = models.CharField(max_length=50, blank=True, null=True, db_column='state')
    zip = models.IntegerField()
    primary_source = models.CharField(max_length=50, blank=True, null=True, db_column='primsource')
    source_desc = models.CharField(max_length=50, blank=True, null=True, db_column='source_desc')
    tech_desc = models.CharField(max_length=50, blank=True, null=True, db_column='tech_desc')
    install_mw = models.CharField(max_length=50, blank=True, null=True, db_column='install_mw')
    total_mw = models.CharField(max_length=50, blank=True, null=True, db_column='total_mw')
    battery_mw = models.CharField(max_length=50, blank=True, null=True, db_column='bat_mw')
    biodiesel_mw = models.CharField(max_length=50, blank=True, null=True, db_column='bio_mw')
    coal_mw = models.CharField(max_length=50, blank=True, null=True, db_column='coal_mw')
    geothermal_mw = models.CharField(max_length=50, blank=True, null=True, db_column='geo_mw')
    hydro_mw = models.CharField(max_length=50, blank=True, null=True, db_column='hydro_mw')
    hydrops_mw = models.CharField(max_length=50, blank=True, null=True, db_column='hydrops_mw')
    naturalgas_mw = models.CharField(max_length=50, blank=True, null=True, db_column='ng_mw')
    nuclear_mw = models.CharField(max_length=50, blank=True, null=True, db_column='nuclear_mw')
    crude_mw = models.CharField(max_length=50, blank=True, null=True, db_column='crude_mw')
    solar_mw = models.CharField(max_length=50, blank=True, null=True, db_column='solar_mw')
    wind_mw = models.CharField(max_length=50, blank=True, null=True, db_column='wind_mw')
    other_mw = models.CharField(max_length=50, blank=True, null=True, db_column='other_mw')
    source = models.CharField(max_length=50, blank=True, null=True, db_column='source')
    period = models.CharField(max_length=50, blank=True, null=True, db_column='period')
    longitude = models.CharField(max_length=50, blank=True, null=True, db_column='longitude')
    latitude = models.CharField(max_length=50, blank=True, null=True, db_column='latitude')
    class Meta:
        managed = False
        db_table = '"eia"."powerplants_naturalgas"'
    
    def __str__(self) -> str:
        return super().__str__()

class Plants_Nuclear(models.Model):
    id = models.IntegerField(primary_key=True, db_column='id')
    plant_code = models.IntegerField()
    plant_name = models.CharField(max_length=50, blank=True, null=True, db_column='plant_name')
    utility_id = models.IntegerField()
    utility_name = models.CharField(max_length=50, blank=True, null=True, db_column='utility_name')
    sector_name = models.CharField(max_length=50, blank=True, null=True, db_column='sector_name')
    street_address = models.CharField(max_length=50, blank=True, null=True, db_column='street_address')
    city = models.CharField(max_length=50, blank=True, null=True, db_column='city')
    county = models.CharField(max_length=50, blank=True, null=True, db_column='county')
    state = models.CharField(max_length=50, blank=True, null=True, db_column='state')
    zip = models.IntegerField()
    primary_source = models.CharField(max_length=50, blank=True, null=True, db_column='primsource')
    source_desc = models.CharField(max_length=50, blank=True, null=True, db_column='source_desc')
    tech_desc = models.CharField(max_length=50, blank=True, null=True, db_column='tech_desc')
    install_mw = models.CharField(max_length=50, blank=True, null=True, db_column='install_mw')
    total_mw = models.CharField(max_length=50, blank=True, null=True, db_column='total_mw')
    battery_mw = models.CharField(max_length=50, blank=True, null=True, db_column='bat_mw')
    biodiesel_mw = models.CharField(max_length=50, blank=True, null=True, db_column='bio_mw')
    coal_mw = models.CharField(max_length=50, blank=True, null=True, db_column='coal_mw')
    geothermal_mw = models.CharField(max_length=50, blank=True, null=True, db_column='geo_mw')
    hydro_mw = models.CharField(max_length=50, blank=True, null=True, db_column='hydro_mw')
    hydrops_mw = models.CharField(max_length=50, blank=True, null=True, db_column='hydrops_mw')
    naturalgas_mw = models.CharField(max_length=50, blank=True, null=True, db_column='ng_mw')
    nuclear_mw = models.CharField(max_length=50, blank=True, null=True, db_column='nuclear_mw')
    crude_mw = models.CharField(max_length=50, blank=True, null=True, db_column='crude_mw')
    solar_mw = models.CharField(max_length=50, blank=True, null=True, db_column='solar_mw')
    wind_mw = models.CharField(max_length=50, blank=True, null=True, db_column='wind_mw')
    other_mw = models.CharField(max_length=50, blank=True, null=True, db_column='other_mw')
    source = models.CharField(max_length=50, blank=True, null=True, db_column='source')
    period = models.CharField(max_length=50, blank=True, null=True, db_column='period')
    longitude = models.CharField(max_length=50, blank=True, null=True, db_column='longitude')
    latitude = models.CharField(max_length=50, blank=True, null=True, db_column='latitude')
    class Meta:
        managed = False
        db_table = '"eia"."powerplants_nuclear"'
    
    def __str__(self) -> str:
        return super().__str__()

class Plants_Petroleum(models.Model):
    id = models.IntegerField(primary_key=True, db_column='id')
    plant_code = models.IntegerField()
    plant_name = models.CharField(max_length=50, blank=True, null=True, db_column='plant_name')
    utility_id = models.IntegerField()
    utility_name = models.CharField(max_length=50, blank=True, null=True, db_column='utility_name')
    sector_name = models.CharField(max_length=50, blank=True, null=True, db_column='sector_name')
    street_address = models.CharField(max_length=50, blank=True, null=True, db_column='street_address')
    city = models.CharField(max_length=50, blank=True, null=True, db_column='city')
    county = models.CharField(max_length=50, blank=True, null=True, db_column='county')
    state = models.CharField(max_length=50, blank=True, null=True, db_column='state')
    zip = models.IntegerField()
    primary_source = models.CharField(max_length=50, blank=True, null=True, db_column='primsource')
    source_desc = models.CharField(max_length=50, blank=True, null=True, db_column='source_desc')
    tech_desc = models.CharField(max_length=50, blank=True, null=True, db_column='tech_desc')
    install_mw = models.CharField(max_length=50, blank=True, null=True, db_column='install_mw')
    total_mw = models.CharField(max_length=50, blank=True, null=True, db_column='total_mw')
    battery_mw = models.CharField(max_length=50, blank=True, null=True, db_column='bat_mw')
    biodiesel_mw = models.CharField(max_length=50, blank=True, null=True, db_column='bio_mw')
    coal_mw = models.CharField(max_length=50, blank=True, null=True, db_column='coal_mw')
    geothermal_mw = models.CharField(max_length=50, blank=True, null=True, db_column='geo_mw')
    hydro_mw = models.CharField(max_length=50, blank=True, null=True, db_column='hydro_mw')
    hydrops_mw = models.CharField(max_length=50, blank=True, null=True, db_column='hydrops_mw')
    naturalgas_mw = models.CharField(max_length=50, blank=True, null=True, db_column='ng_mw')
    nuclear_mw = models.CharField(max_length=50, blank=True, null=True, db_column='nuclear_mw')
    crude_mw = models.CharField(max_length=50, blank=True, null=True, db_column='crude_mw')
    solar_mw = models.CharField(max_length=50, blank=True, null=True, db_column='solar_mw')
    wind_mw = models.CharField(max_length=50, blank=True, null=True, db_column='wind_mw')
    other_mw = models.CharField(max_length=50, blank=True, null=True, db_column='other_mw')
    source = models.CharField(max_length=50, blank=True, null=True, db_column='source')
    period = models.CharField(max_length=50, blank=True, null=True, db_column='period')
    longitude = models.CharField(max_length=50, blank=True, null=True, db_column='longitude')
    latitude = models.CharField(max_length=50, blank=True, null=True, db_column='latitude')
    class Meta:
        managed = False
        db_table = '"eia"."powerplants_petroleum"'
    
    def __str__(self) -> str:
        return super().__str__()

class Plants_Processing_Naturalgas(models.Model):
    id = models.IntegerField(primary_key=True, db_column='id')
    plant_name = models.CharField(max_length=50, blank=True, null=True, db_column='plant_name')
    owner = models.CharField(max_length=50, blank=True, null=True, db_column='owner')
    operator = models.CharField(max_length=50, blank=True, null=True, db_column='operator')
    state = models.CharField(max_length=50, blank=True, null=True, db_column='state')
    county = models.CharField(max_length=50, blank=True, null=True, db_column='county')
    city = models.CharField(max_length=50, blank=True, null=True, db_column='city')
    zipcode = models.CharField(max_length=50, blank=True, null=True, db_column='zipcode')
    capacity_mmcfd = models.CharField(max_length=50, blank=True, null=True, db_column='cap_mmcfd')
    plant_flow = models.CharField(max_length=50, blank=True, null=True, db_column='plant_flow')
    btu_content = models.CharField(max_length=50, blank=True, null=True, db_column='btu_content')
    dry_storage = models.IntegerField(db_column='dry_stor')
    naturalgasliquid_storage = models.IntegerField(db_column='ngl_stor')
    longitude = models.CharField(max_length=50, blank=True, null=True, db_column='longitude')
    latitude = models.CharField(max_length=50, blank=True, null=True, db_column='latitude')
    period = models.IntegerField()
    source = models.CharField(max_length=50, blank=True, null=True, db_column='source')
    loc_source = models.CharField(max_length=50, blank=True, null=True, db_column='loc_source')
    class Meta:
        managed = False
        db_table = '"eia"."processing_plants_naturalgas"'
    
    def __str__(self) -> str:
        return super().__str__()
    
class Plants_Refinery_Petroleum(models.Model):
    id = models.IntegerField(primary_key=True, db_column='id')
    site_id = models.IntegerField()
    company = models.CharField(max_length=50, blank=True, null=True, db_column='company')
    corp = models.CharField(max_length=50, blank=True, null=True, db_column='corp')
    site = models.CharField(max_length=50, blank=True, null=True, db_column='site')
    state = models.CharField(max_length=50, blank=True, null=True, db_column='state')
    padd = models.IntegerField()
    atmospheric_distillation_mbpd = models.CharField(max_length=50, blank=True, null=True, db_column='ad_mbpd')
    vacuum_distillation_mbpd = models.CharField(max_length=50, blank=True, null=True, db_column='vdist_mbpd')
    catalytic_distillation_mbpd = models.CharField(max_length=50, blank=True, null=True, db_column='cadis_mbpd')        
    hydrocracking_mbpd = models.CharField(max_length=50, blank=True, null=True, db_column='hycrk_mbpd')
    vredu_mbpd = models.CharField(max_length=50, blank=True, null=True, db_column='vredu_mbpd')
    catalytic_reforming_mbpd = models.CharField(max_length=50, blank=True, null=True, db_column='caref_mbpd')
    isomerization_mbpd = models.CharField(max_length=50, blank=True, null=True, db_column='isal_mbpd')
    hydrodesulfurization_mbpd = models.CharField(max_length=50, blank=True, null=True, db_column='hds_mbpd')
    coking_mbpd = models.CharField(max_length=50, blank=True, null=True, db_column='cokin_mbpd')
    asphalt_production_mbpd = models.CharField(max_length=50, blank=True, null=True, db_column='asph_mbpd')
    source = models.CharField(max_length=50, blank=True, null=True, db_column='source')
    period = models.CharField(max_length=50, blank=True, null=True, db_column='period')
    latitude = models.CharField(max_length=50, blank=True, null=True, db_column='latitude')
    longitude = models.CharField(max_length=50, blank=True, null=True, db_column='longitude')

    class Meta:
        managed = False
        db_table = '"eia"."refineries_petroleum"'
    
    def __str__(self) -> str:
        return super().__str__()

class Reserve_Petroleum(models.Model):
    id = models.IntegerField(primary_key=True, db_column='id')
    company = models.CharField(max_length=50, blank=True, null=True, db_column='company')
    site = models.CharField(max_length=50, blank=True, null=True, db_column='site')
    state = models.CharField(max_length=50, blank=True, null=True, db_column='state')
    padd = models.IntegerField()
    heatingoil_storage = models.IntegerField()
    other_storage = models.IntegerField()
    source = models.CharField(max_length=50, blank=True, null=True, db_column='source')
    period = models.CharField(max_length=50, blank=True, null=True, db_column='period')
    longitude = models.CharField(max_length=50, blank=True, null=True, db_column='longitude')
    latitude = models.CharField(max_length=50, blank=True, null=True, db_column='latitude')
    class Meta:
        managed = False
        db_table = '"eia"."reserves_petroleum"'
    
    def __str__(self) -> str:
        return super().__str__()
    
class Storage_Naturalgas(models.Model):
    id = models.IntegerField(primary_key=True, db_column='id')
    field_code = models.IntegerField(db_column='fld_code')
    reservoir_code = models.IntegerField(db_column='res_code')
    field = models.CharField(max_length=50, blank=True, null=True, db_column='field')
    reservoir = models.CharField(max_length=50, blank=True, null=True, db_column='reservoir')
    field_type = models.CharField(max_length=50, blank=True, null=True, db_column='field_type')
    company = models.CharField(max_length=50, blank=True, null=True, db_column='company')
    county = models.CharField(max_length=50, blank=True, null=True, db_column='county')
    state = models.CharField(max_length=50, blank=True, null=True, db_column='state')
    region = models.CharField(max_length=50, blank=True, null=True, db_column='region')
    status = models.CharField(max_length=50, blank=True, null=True, db_column='status')
    base_gas_bcf = models.IntegerField( db_column='base_gas')
    working_capacity_bcf = models.IntegerField( db_column='work_cap')
    field_capcity_bcf = models.IntegerField(db_column='fld_cap')
    max_deliverability_mmcfd = models.IntegerField( db_column='maxdeliv')
    source = models.CharField(max_length=50, blank=True, null=True, db_column='source')
    period = models.CharField(max_length=50, blank=True, null=True, db_column='period')
    longitude = models.CharField(max_length=50, blank=True, null=True, db_column='longitude')
    latitude = models.CharField(max_length=50, blank=True, null=True, db_column='latitude')
    class Meta:
        managed = False
        db_table = '"eia"."undergroundstorage_naturalgas"'
    
    def __str__(self) -> str:
        return super().__str__()

class Terminal_Crudeoil(models.Model):
    id = models.IntegerField(primary_key=True, db_column='id')
    site_name = models.CharField(max_length=50, blank=True, null=True, db_column='site_name')
    city = models.CharField(max_length=50, blank=True, null=True, db_column='city')
    state = models.CharField(max_length=50, blank=True, null=True, db_column='state')
    padd = models.IntegerField()
    station_type = models.CharField(max_length=50, blank=True, null=True, db_column='station_ty')
    facility_type = models.CharField(max_length=50, blank=True, null=True, db_column='facility_t')
    handling = models.CharField(max_length=50, blank=True, null=True, db_column='handling')
    longitude = models.CharField(max_length=50, blank=True, null=True, db_column='longitude')
    latitude = models.CharField(max_length=50, blank=True, null=True, db_column='latitude')
    class Meta:
        managed = False
        db_table = '"eia"."terminals_crudeoil_rail"'
    
    def __str__(self) -> str:
        return super().__str__()
    
class Terminal_Lng(models.Model):
    id = models.IntegerField(primary_key=True, db_column='id')
    facility = models.CharField(max_length=50, blank=True, null=True, db_column='facility')
    owner = models.CharField(max_length=50, blank=True, null=True, db_column='owner')
    operator = models.CharField(max_length=50, blank=True, null=True, db_column='operator')
    city = models.CharField(max_length=50, blank=True, null=True, db_column='city')
    county = models.CharField(max_length=50, blank=True, null=True, db_column='county')
    state = models.CharField(max_length=50, blank=True, null=True, db_column='state')
    functions = models.CharField(max_length=50, blank=True, null=True, db_column='functions')
    regasification_capacity_bcfd = models.CharField(max_length=50, blank=True, null=True, db_column='regas_bcfd')       
    storagecapacity_bcf = models.CharField(max_length=50, blank=True, null=True, db_column='stora_bcf')
    liquid_baseload_bcfd = models.CharField(max_length=50, blank=True, null=True, db_column='liq_baseload_bcfd')        
    liquid_peak_bcfd = models.CharField(max_length=50, blank=True, null=True, db_column='liq_peak_bcfd')
    period = models.CharField(max_length=50, blank=True, null=True, db_column='period')
    source = models.CharField(max_length=50, blank=True, null=True, db_column='source')
    latitude = models.CharField(max_length=50, blank=True, null=True, db_column='latitude')
    longitude = models.CharField(max_length=50, blank=True, null=True, db_column='longitude')
    class Meta:
        managed = False
        db_table = '"eia"."terminals_lng"'
    
    def __str__(self) -> str:
        return super().__str__()
    
class Terminal_Petroleum(models.Model):
    id = models.IntegerField(primary_key=True, db_column='id')
    company = models.CharField(max_length=50, blank=True, null=True, db_column='company')
    site = models.CharField(max_length=50, blank=True, null=True, db_column='site')
    city = models.CharField(max_length=50, blank=True, null=True, db_column='city')
    state = models.CharField(max_length=50, blank=True, null=True, db_column='state')
    padd = models.IntegerField()
    source = models.CharField(max_length=50, blank=True, null=True, db_column='source')
    period = models.CharField(max_length=50, blank=True, null=True, db_column='period')
    longitude = models.CharField(max_length=50, blank=True, null=True, db_column='longitude')
    latitude = models.CharField(max_length=50, blank=True, null=True, db_column='latitude')
    class Meta:
        managed = False
        db_table = '"eia"."terminals_petroleum"'
    
    def __str__(self) -> str:
        return super().__str__()