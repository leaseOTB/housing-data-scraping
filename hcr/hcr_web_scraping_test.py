from selenium import webdriver
from selenium.webdriver.support.select import Select
import time
import pandas as pd
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.common.by import By
import math


def main():
    browser = webdriver.Chrome()
    browser.get("https://apps.hcr.ny.gov/BuildingSearch/")
    browser.find_element_by_xpath('//*[@id="ctl00_ContentPlaceHolder1_zipCodeSearchLinkButton"]').click()
    county_selector = browser.find_element_by_xpath('//*[@id="ctl00_ContentPlaceHolder1_countyListDropDown"]')
    county = [header.text for header in county_selector.find_elements_by_tag_name('option')]

    for c in county[1:]:
        print(c)
        county_selector = Select(
            browser.find_element_by_xpath('//*[@id="ctl00_ContentPlaceHolder1_countyListDropDown"]'))
        county_selector.select_by_visible_text(c)
        time.sleep(1)
        zip_list = browser.find_element_by_xpath('//*[@id="ctl00_ContentPlaceHolder1_zipCodesDropDown"]')
        zip = [header.text for header in zip_list.find_elements_by_tag_name('option')]
        print(zip)
        for y in zip[1:]:
            print(y)
            zip_selector = Select(
                browser.find_element_by_xpath('//*[@id="ctl00_ContentPlaceHolder1_zipCodesDropDown"]'))
            zip_selector.select_by_visible_text(y)
            browser.find_element_by_xpath('//*[@id="ctl00_ContentPlaceHolder1_submitZipCodeButton"]').click()
            time.sleep(1)
            abc = browser.find_elements_by_xpath(
                '//*[@id="ctl00_ContentPlaceHolder1_buildingsGridView"]/tbody/tr[1]/td/table/tbody/tr/td[2]/b')
            if not abc:
                continue
            print(abc[0].text)
            temp_loop = abc[0].text.split()
            a = int(temp_loop[6])
            temp_loop_extend = math.ceil(a / 50)
            for next in range(0, temp_loop_extend):
                print(f"{next + 1} of {temp_loop_extend}")
                file_data = []
                time.sleep(3)
                table = browser.find_elements_by_xpath('//*[@id="ctl00_ContentPlaceHolder1_buildingsGridView"]')
                WebDriverWait(browser, 30).until(
                    expected_conditions.presence_of_element_located((By.TAG_NAME, 'tr')))
                for x in table:
                    time.sleep(2)
                    for y in browser.find_elements_by_tag_name("tr"):
                        file_header = [header.text for header in y.find_elements_by_tag_name('td')]
                        file_data.append(file_header)
                print(file_data[0])
                df = pd.DataFrame(file_data)
                df.to_csv(f"hcr_text_{c}.csv", index=False, mode='a')
                if browser.find_elements_by_xpath(
                        '//*[@id="ctl00_ContentPlaceHolder1_buildingsGridView_ctl01_btnNext"]'):
                    next_button = browser.find_element_by_xpath(
                        '//*[@id="ctl00_ContentPlaceHolder1_buildingsGridView_ctl01_btnNext"]')
                    next_button.click()
                    time.sleep(4)


if __name__ == '__main__': main()
