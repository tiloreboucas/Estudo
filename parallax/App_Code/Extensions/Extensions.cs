using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Converters;
using System.Data;
using System.Reflection;

namespace site.Extensions
{
    public static class Extensions
    {
        #region Extension JSON
        public static string ToJSON<T>(this T input)
        {
            return "{ d: " + JsonConvert.SerializeObject(input, Formatting.None, new IsoDateTimeConverter() { DateTimeFormat = "MM-dd-yyyy" }) + "}";
        }

        public static string ToJSONDateTime<T>(this T input)
        {
            return "{ d: " + JsonConvert.SerializeObject(input, Formatting.None, new IsoDateTimeConverter() { DateTimeFormat = "MM-dd-yyyy HH:mm:ss" }) + "}";
        }

        public static List<T> JSON2List<T>(this string input)
        {
            string newString = input.Replace("{ d: ", String.Empty).Replace("{ d:", String.Empty).Replace("{d: ", String.Empty).Replace("{d:", String.Empty).Trim();
            if (input.Length > newString.Length)
                newString = newString.Substring(0, newString.Length - 1);
            return JsonConvert.DeserializeObject<List<T>>(newString);
        }
        public static Dictionary<string, object> JSON2ParametersDictionary(this string input)
        {
            string newString = input.Replace("{ d: ", String.Empty).Replace("{ d:", String.Empty).Replace("{d: ", String.Empty).Replace("{d:", String.Empty).Trim();
            if (input.Length > newString.Length)
                newString = newString.Substring(0, newString.Length - 1);
            return JsonConvert.DeserializeObject<Dictionary<string, object>>(newString);
        }
        public static System.Data.DataTable JSON2DataTable(this string input)
        {
            string newString = input.Replace("{ d: ", String.Empty).Replace("{ d:", String.Empty).Replace("{d: ", String.Empty).Replace("{d:", String.Empty).Trim();
            if (input.Length > newString.Length)
                newString = newString.Substring(0, newString.Length - 1);
            return JsonConvert.DeserializeObject<System.Data.DataTable>(newString);
        }
        #endregion
        #region Extensions DataTable
        private static Dictionary<Type, IList<PropertyInfo>> typeDictionary = new Dictionary<Type, IList<PropertyInfo>>();
        public static IList<PropertyInfo> GetPropertiesForType<T>()
        {
            var type = typeof(T);


            if(!typeDictionary.ContainsKey(typeof(T)))
            {
                typeDictionary.Add(type, type.GetProperties().Where(prop => !prop.Name.Equals("CountListaData")).ToList());
            }
            return typeDictionary[type];
        }
        public static List<T> ToList<T>(this DataTable table) where T : new()
        {
            IList<PropertyInfo> properties = GetPropertiesForType<T>();
            List<T> result = new List<T>();

            foreach (var row in table.Rows)
            {
                var item = CreateItemFromRow<T>((DataRow)row, properties);
                result.Add(item);
            }

            return result;
        }
        private static T CreateItemFromRow<T>(DataRow row, IList<PropertyInfo> properties) where T : new()
        {
            T item = new T();
            foreach (var property in properties)
            {
                property.SetValue(item, row[property.Name], null);
            }
            return item;
        }
        #endregion
    }
}