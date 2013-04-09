using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using Newtonsoft.Json;

namespace site
{
    public class CheckIP
    {

        public string GetCountryByIP(string ipAddress)
        {
            try
            {
                string LoadJson = IPRequestHelper("http://www.geoplugin.net/json.gp?ip=" + ipAddress + "&jsoncallback=", "");
                //LoadJson = LoadJson.Replace("%3F(", "");
                //LoadJson = LoadJson.Substring(0, (LoadJson.Length - 1));
                Dictionary<string, string> parameters = JsonConvert.DeserializeObject<Dictionary<string, string>>(LoadJson);

                if (parameters == null)
                {
                    return "BR";
                }
                else
                {
                    return parameters["geoplugin_countryCode"].ToString();
                }
            }
            catch (Exception e)
            {
                return "BR";
            }
        }

        public string IPRequestHelper(string url, string ipAddress)
        {
            string checkURL = url + ipAddress;

            HttpWebRequest objRequest = (HttpWebRequest)WebRequest.Create(url);
            HttpWebResponse objResponse = (HttpWebResponse)objRequest.GetResponse();

            StreamReader responseStream = new StreamReader(objResponse.GetResponseStream());
            string responseRead = responseStream.ReadToEnd();

            responseStream.Close();
            responseStream.Dispose();

            return responseRead;
        }
    }
}