using System.Web.Optimization;

namespace BingMap
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/app").Include(
                "~/Scripts/app/_run.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                 "~/Content/ol.css"));
        }
    }
}
