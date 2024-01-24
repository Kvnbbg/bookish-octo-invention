@views_bp.route("/<new_target>")
def redirect_stdout(new_target):
    try:
        templates = {
            "admin": admin(),
            "patient": patient(),
            "recipe detail": "recipe_detail.html",
            "recipes": recipes(),
            "register": register(),
            "search_results": search_results(),
            "search": search(),
            "404": page_not_found(new_target),
            "500": internal_server_error(new_target),
            "about": about(),
            "add recipe": add_recipe(),
            "author": author(),
            "confid": "confidential.html",
            "contact": contact(),
            "index": index(),
            "legal": "legal.html",
            "login": login(),
            "logout": logout,
            "my_services": "my_services.html",
            "profile": profile(),
            "home": index(),  # assuming 'home' maps to 'index.html'
        }


        template = templates.get(new_target, "404.html")
        flash(f"You visited: {new_target}")

        return render_template(template, new_target=new_target)
    except Exception as e:
        current_app.logger.exception(f"Error accessing {new_target}: {e}")
        return render_template("500.html", error_details=str(e)), 500