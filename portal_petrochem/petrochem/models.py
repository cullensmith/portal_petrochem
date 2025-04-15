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
    
# class CountyNames(models.Model):
#     county = models.CharField(max_length=50)
#     statename = models.CharField(max_length=20)
#     stusps = models.CharField(max_length=2)

#     class Meta:
#         managed = False
#         db_table = 'county_wstate'
    
#     def __str__(self) -> str:
#         return super().__str__()
    
# class stStatus(models.Model):
#     well_status = models.CharField(max_length=50)
#     stusps = models.CharField(max_length=2)

#     class Meta:
#         managed = False
#         db_table = 'wellstatus'
    
#     def __str__(self) -> str:
#         return super().__str__()
    
# class stType(models.Model):
#     well_type = models.CharField(max_length=50)
#     stusps = models.CharField(max_length=2)

#     class Meta:
#         managed = False
#         db_table = 'welltype'
    
#     def __str__(self) -> str:
#         return super().__str__()

# class Wells(models.Model):
#     api_num = models.CharField(max_length=50, blank=True, null=True)
#     other_id = models.CharField(max_length=50, blank=True, null=True)
#     latitude = models.FloatField(blank=True, null=True)
#     longitude = models.FloatField(blank=True, null=True)
#     stusps = models.CharField(max_length=50, blank=True, null=True)
#     county = models.CharField(max_length=50, blank=True, null=True)
#     municipality = models.CharField(max_length=50, blank=True, null=True)
#     well_name = models.CharField(max_length=50, blank=True, null=True)
#     operator = models.CharField(max_length=50, blank=True, null=True)
#     spud_date = models.CharField(max_length=50, blank=True, null=True)
#     plug_date = models.CharField(max_length=50, blank=True, null=True)
#     well_type = models.CharField(max_length=50, blank=True, null=True)
#     well_status = models.CharField(max_length=50, blank=True, null=True)
#     well_configuration = models.CharField(max_length=50, blank=True, null=True)
#     ft_category = models.CharField(max_length=50, blank=True, null=True)
#     # wellwiki = models.CharField(max_length=50, blank=True, null=True)
#     # ftuid = models.IntegerField(blank=True, null=True)
#     id = models.IntegerField(primary_key=True)

#     class Meta:
#         managed = True
#         db_table = 'wells'
    
#     def __str__(self) -> str:
#         return super().__str__()
    

class Compressors(models.Model):
    id = models.IntegerField(primary_key=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    y = models.FloatField(blank=True, null=True)
    x = models.FloatField(blank=True, null=True)
    status = models.CharField(max_length=50, blank=True, null=True)
    elec_compr = models.CharField(max_length=50, blank=True, null=True)
    type = models.CharField(max_length=50, blank=True, null=True)
    zip4 = models.CharField(max_length=50, blank=True, null=True)
    zip = models.CharField(max_length=50, blank=True, null=True)
    exp_power = models.CharField(max_length=50, blank=True, null=True)
    fid = models.CharField(max_length=50, blank=True, null=True)
    # geom = models.CharField(max_length=50, blank=True, null=True)
    source = models.CharField(max_length=50, blank=True, null=True)
    gas_compre = models.CharField(max_length=50, blank=True, null=True)
    num_units = models.CharField(max_length=50, blank=True, null=True)
    objectid = models.CharField(max_length=50, blank=True, null=True)
    cert_hp = models.CharField(max_length=50, blank=True, null=True)
    exp_other = models.CharField(max_length=50, blank=True, null=True)
    gcompid = models.CharField(max_length=50, blank=True, null=True)
    state = models.CharField(max_length=50, blank=True, null=True)
    city = models.CharField(max_length=50, blank=True, null=True)
    op_date_pe = models.CharField(max_length=50, blank=True, null=True)
    address = models.CharField(max_length=50, blank=True, null=True)
    exp_fuel = models.CharField(max_length=50, blank=True, null=True)
    name = models.CharField(max_length=50, blank=True, null=True)
    op_num_com = models.CharField(max_length=50, blank=True, null=True)
    op_comp_hr = models.CharField(max_length=50, blank=True, null=True)
    plant_cost = models.CharField(max_length=50, blank=True, null=True)
    county = models.CharField(max_length=50, blank=True, null=True)
    posrel = models.CharField(max_length=50, blank=True, null=True)
    val_date = models.CharField(max_length=50, blank=True, null=True)
    website = models.CharField(max_length=50, blank=True, null=True)
    pipeco = models.CharField(max_length=50, blank=True, null=True)
    compid = models.CharField(max_length=50, blank=True, null=True)
    country = models.CharField(max_length=50, blank=True, null=True)
    val_method = models.CharField(max_length=50, blank=True, null=True)
    naics_desc = models.CharField(max_length=50, blank=True, null=True)
    naics_code = models.CharField(max_length=50, blank=True, null=True)
    operator = models.CharField(max_length=50, blank=True, null=True)
    sourcedate = models.CharField(max_length=50, blank=True, null=True)
    countyfips = models.CharField(max_length=50, blank=True, null=True) 

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
    id = models.IntegerField(primary_key=True)
    fid = models.IntegerField()
    linename = models.CharField(max_length=50, blank=True, null=True)
    owner = models.CharField(max_length=50, blank=True, null=True)
    latitude = models.CharField(max_length=50, blank=True, null=True)
    longitude = models.CharField(max_length=50, blank=True, null=True)
    city = models.CharField(max_length=50, blank=True, null=True)
    county = models.CharField(max_length=50, blank=True, null=True)
    stateprov = models.CharField(max_length=50, blank=True, null=True)
    frmstate = models.CharField(max_length=50, blank=True, null=True)
    frmcountry = models.CharField(max_length=50, blank=True, null=True)
    tostate = models.CharField(max_length=50, blank=True, null=True)
    tocountry = models.CharField(max_length=50, blank=True, null=True)
    num_lines = models.IntegerField()
    voltage_kv = models.CharField(max_length=50, blank=True, null=True)
    source = models.CharField(max_length=50, blank=True, null=True)
    period = models.IntegerField()
    x = models.CharField(max_length=50, blank=True, null=True)
    y = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = '"eia"."bordercrossing_electric"'
    
    def __str__(self) -> str:
        return super().__str__()
    
class Bordercrossing_Liquids(models.Model):
    id = models.IntegerField(primary_key=True)
    fid = models.IntegerField()
    pipeline = models.CharField(max_length=254, blank=True, null=True)
    owner = models.CharField(max_length=254, blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    city = models.CharField(max_length=254, blank=True, null=True)
    county = models.CharField(max_length=254, blank=True, null=True)
    state = models.CharField(max_length=254, blank=True, null=True)
    frmstate = models.CharField(max_length=254, blank=True, null=True)
    frmcountry = models.CharField(max_length=254, blank=True, null=True)
    tostate = models.CharField(max_length=254, blank=True, null=True)
    tocountry = models.CharField(max_length=254, blank=True, null=True)
    typeprod = models.CharField(max_length=254, blank=True, null=True)
    num_pipes = models.IntegerField()
    diameter = models.CharField(max_length=254, blank=True, null=True)
    maxoppress = models.IntegerField()
    source = models.CharField(max_length=254, blank=True, null=True)
    period = models.IntegerField()
    x = models.CharField(max_length=500, blank=True, null=True)
    y = models.CharField(max_length=500, blank=True, null=True)

    class Meta:
        managed = False
        db_table = '"eia"."bordercrossing_liquids"'
    
    def __str__(self) -> str:
        return super().__str__()
    
class Bordercrossing_Naturalgas(models.Model):
    id = models.IntegerField(primary_key=True)
    fid = models.IntegerField()
    pipeline = models.CharField(max_length=254, blank=True, null=True)
    owner = models.CharField(max_length=254, blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    city = models.CharField(max_length=254, blank=True, null=True)
    county = models.CharField(max_length=254, blank=True, null=True)
    state = models.CharField(max_length=254, blank=True, null=True)
    frmstate = models.CharField(max_length=254, blank=True, null=True)
    frmcountry = models.CharField(max_length=254, blank=True, null=True)
    tostate = models.CharField(max_length=254, blank=True, null=True)
    tocountry = models.CharField(max_length=254, blank=True, null=True)
    vol_mmcfd = models.IntegerField()
    source = models.CharField(max_length=254, blank=True, null=True)
    period = models.IntegerField()
    x = models.CharField(max_length=500, blank=True, null=True)
    y = models.CharField(max_length=500, blank=True, null=True)

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
    id = models.IntegerField(primary_key=True)
    fid = models.IntegerField()
    hubname = models.CharField(max_length=50, blank=True, null=True)
    period = models.IntegerField()
    latitude = models.CharField(max_length=50, blank=True, null=True)
    longitude = models.CharField(max_length=50, blank=True, null=True)
    x = models.CharField(max_length=50, blank=True, null=True)
    y = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = '"eia"."markethubs_naturalgas"'
    
    def __str__(self) -> str:
        return super().__str__()
    
class Ports_Petroleum(models.Model):
    id = models.IntegerField(primary_key=True)
    fid = models.IntegerField()
    portcode = models.CharField(max_length=50, blank=True, null=True)
    name = models.CharField(max_length=50, blank=True, null=True)
    state = models.CharField(max_length=50, blank=True, null=True)
    longitude = models.CharField(max_length=50, blank=True, null=True)
    latitude = models.CharField(max_length=50, blank=True, null=True)
    dataperiod = models.IntegerField()
    datasource = models.CharField(max_length=50, blank=True, null=True)
    x = models.CharField(max_length=50, blank=True, null=True)
    y = models.CharField(max_length=50, blank=True, null=True)

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
    geomjson = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = '"eia"."petrofacill_1km_pop_042025"'
    
    def __str__(self) -> str:
        return super().__str__()