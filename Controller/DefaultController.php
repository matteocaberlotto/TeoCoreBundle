<?php

namespace Teo\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

class DefaultController extends Controller
{
    public function indexAction()
    {
        return $this->render('TeoCoreBundle:Default:index.html.twig');
    }

    public function sitemapAction()
    {
        $lastMod = $this->container->getParameter('last_modified');

        $response = new Response;
        $response->setPublic();
        $response->setLastModified(new \DateTime($lastMod));

        if ($response->isNotModified($this->getRequest())) {
            // return the 304 Response immediately
            return $response;
        }

        $response->headers->set('Content-Type', 'text/xml');
        $response->headers->set('Expires', gmdate("D, d M Y H:i:s", time() + 86400) . " GMT");

        $uris = $this->container->getParameter('teo_core.sitemap_uris');

        return $this->render('TeoCoreBundle:Default:sitemap.xml.twig', array(
            'uris' => $uris
        ), $response);
    }
}
