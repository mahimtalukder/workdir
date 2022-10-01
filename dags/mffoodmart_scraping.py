from airflow import DAG
from airflow.operators.python import PythonOperator, BranchPythonOperator
from airflow.operators.bash import BashOperator

from random import randint
from datetime import datetime

from subprocess import check_output

#mffoodmart
def scrap_mffoodmart():
    scrap_mess = check_output(['npm','run', 'scrapMfffodmart'])
    print (scrap_mess)

def update_category_dims_mffoodmart():
    db_push_message = check_output(['npm', 'run','updateCategoryDimsForMffoodmart'])
    print (db_push_message)


def upload_product_dims_mffoodmart():
    db_push_message = check_output(['npm', 'run','updateProductDimsForMffoodmart'])
    print (db_push_message)

def upload_product_categories_dims_mffoodmart():
    db_push_message = check_output(['npm', 'run','updateProductCategoriesDimsMffoodmart'])
    print (db_push_message)

def upload_fatcs_mffoodmart():
    db_push_message = check_output(['npm', 'run','updateProductFactsForMffoodmart'])
    print (db_push_message)

#turkishfoodmart
def scrap_mffoodmart_turkishfoodmart():
    scrap_mess = check_output(['npm','run', 'scrapTurkishfoodmart'])
    print (scrap_mess)

def update_category_dims_turkishfoodmart():
    db_push_message = check_output(['npm', 'run','updateCategoryDimsForTurkishfoodmart'])
    print (db_push_message)


def upload_product_dims_turkishfoodmart():
    db_push_message = check_output(['npm', 'run','updateProductDimsForTurkishfoodmart'])
    print (db_push_message)

def upload_product_categories_dims_turkishfoodmart():
    db_push_message = check_output(['npm', 'run','UpdateProductCategoriesDimsTurkishfoodmart'])
    print (db_push_message)

def upload_fatcs_turkishfoodmart():
    db_push_message = check_output(['npm', 'run','updateProductFactsForTurkishfoodmart'])
    print (db_push_message)



def _training_model():
    return randint(1, 10)

with DAG("scaping_task", start_date=datetime(2021, 1, 1),
    schedule_interval="@daily", catchup=False) as dag:

        #mffodmart
        mffoodmart_scrap = PythonOperator(
            task_id='mffoodmart_scrap',
            python_callable=scrap_mffoodmart
        )


        mffoodmart_category_dim_upgrade = PythonOperator(
            task_id='mffoodmart_category_dim_upgrade',
            python_callable=update_category_dims_mffoodmart
        )


        mffoodmart_product_dim_upgrade = PythonOperator(
            task_id='mffoodmart_product_dim_upgrade',
            python_callable=upload_product_dims_mffoodmart
        )


        mffoodmart_product_categories_dim_upgrade = PythonOperator(
            task_id='mffoodmart_product_categories_dim_upgrade',
            python_callable=upload_product_categories_dims_mffoodmart
        )

        mffoodmart_fact_upload = PythonOperator(
            task_id='mffoodmart_fact_upload',
            python_callable=upload_fatcs_mffoodmart
        )

        #turkishfoodmart
        turkishfoodmart_scrap = PythonOperator(
            task_id='turkishfoodmart_scrap',
            python_callable=scrap_mffoodmart_turkishfoodmart
        )


        turkishfoodmart_category_dim_upgrade = PythonOperator(
            task_id='turkishfoodmart_category_dim_upgrade',
            python_callable=update_category_dims_turkishfoodmart
        )


        turkishfoodmart_product_dim_upgrade = PythonOperator(
            task_id='turkishfoodmart_product_dim_upgrade',
            python_callable=upload_product_dims_turkishfoodmart
        )


        turkishfoodmart_product_categories_dim_upgrade = PythonOperator(
            task_id='turkishfoodmart_product_categories_dim_upgrade',
            python_callable=upload_product_categories_dims_turkishfoodmart
        )

        turkishfoodmart_fact_upload = PythonOperator(
            task_id='turkishfoodmart_fact_upload',
            python_callable=upload_fatcs_turkishfoodmart
        )

        mffoodmart_scrap >> [mffoodmart_category_dim_upgrade, mffoodmart_product_dim_upgrade] >> mffoodmart_product_categories_dim_upgrade >> mffoodmart_fact_upload >> turkishfoodmart_scrap >> [turkishfoodmart_category_dim_upgrade, turkishfoodmart_product_dim_upgrade] >> turkishfoodmart_product_categories_dim_upgrade >> turkishfoodmart_fact_upload
