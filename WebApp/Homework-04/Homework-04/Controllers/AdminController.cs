using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Mvc;

namespace Homework_04.Controllers
{
    public class AdminController : Controller
    {

        public ActionResult Dashboard()
        {
            ViewBag.Title = "Dashboard";

            return View("~/Views/Admin/Dashboard.cshtml");
        }
    }
}
